import ticketRepository from "../Repository/ticketRepository.js";
import ticketsUtils from "../Utils/ticketsUtils.js";

class ticketController {
  async postTicket(req, res) {
    const arrDados = await ticketsUtils.postNewTicket(req.body, req);

    try {
      const created = await ticketRepository.postTicket(arrDados);
      return res.status(201).json({
        error: false,
        msgUser: "Ingresso cadastrado com sucesso.",
        msgOriginal: null,
        result: {
          ticket: created,
          event: ticketsUtils.getEventInfo(),
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser:
          "Ocorreu um erro ao tentar cadastrar o ingresso. Verifique as informações e tente novamente.",
        msgOriginal: "Erro ao inserir ingresso na tabela tickets",
      });
    }
  }

  async getAllTickets(req, res) {
    try {
      const startRow = req.query.start_row ? req.query.start_row : 0;
      const endRow = req.query.end_row ? req.query.end_row : 10;
      const query = req.query.query ? req.query.query : "";
      const tag = req.query.tag ? req.query.tag : "";

      const tickets = await ticketRepository.getAllTickets(
        startRow,
        endRow,
        query,
        tag
      );

      const total = !query
        ? await ticketRepository.getAllTotal()
        : await ticketRepository.getAllTotalLike(query, tag);

      return res.status(200).json({
        error: false,
        msgUser: null,
        msgOriginal: null,
        result: {
          total,
          tickets,
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser: "Ocorreu um erro ao buscar ingressos.",
        msgOriginal: "Erro ao buscar ingressos.",
      });
    }
  }

  async getTicket(req, res) {
    try {
      const id = req.params.id || req.query.id;
      const ticket = await ticketRepository.getTicket(id);

      if (!ticket) {
        return res.status(404).json({
          error: true,
          msgUser: "Ingresso não encontrado.",
          msgOriginal: "Ingresso nao encontrado.",
        });
      }

      return res.status(200).json({
        error: false,
        msgUser: null,
        msgOriginal: null,
        result: {
          ticket,
          event: ticketsUtils.getEventInfo(),
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser: "Ocorreu um erro ao buscar ingresso.",
        msgOriginal: "Erro ao buscar ingressos.",
      });
    }
  }

  async validate(req, res) {
    try {
      const ticket = await ticketRepository.getTicketHash(req.body.hash);

      if (!ticket) {
        return res.status(400).json({
          error: true,
          msgUser: "Ingresso não encontrado.",
          msgOriginal: "Ingresso nao encontrado.",
        });
      }

      if (ticket.status != "A") {
        return res.status(400).json({
          error: true,
          msgUser: "Este ingresso está inativo ou já foi utilizado.",
          msgOriginal: "Ingresso inativo ou utilizado.",
        });
      }

      const result = await ticketRepository.updateStatusTicket(ticket.id, "U");

      if (!result) {
        throw new Error("Erro ao validar ingresso.");
      }

      return res.status(200).json({
        error: false,
        msgUser: "Ingresso validado com sucesso.",
        msgOriginal: null,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser: "Ocorreu um erro ao validar ingresso.",
        msgOriginal: "Erro ao validar ingresso.",
      });
    }
  }

  async delTicket(req, res) {
    const id = req.params.id || req.body.id;
    let verify = false;

    try {
      const arrResult = await ticketRepository.updateStatusTicket(id, "C");
      verify = arrResult.affectedRows != 0 ? false : true;
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser: "Ocorreu um erro ao deletar ingresso.",
        msgOriginal: "Erro ao cancelar ingresso.",
      });
    }

    if (verify) {
      return res.status(400).json({
        error: true,
        msgUser: "Ingresso não encontrado.",
        msgOriginal: "Ingresso nao encontrado.",
      });
    }

    return res.status(200).json({
      error: false,
      msgUser: "Ingresso cancelado com sucesso.",
      msgOriginal: null,
    });
  }

  async putTicket(req, res) {
    const arrDados = await ticketsUtils.putTicket(
      { ...req.body, id: req.params.id || req.body.id },
      req
    );
    const verifyCPF = await ticketsUtils.verifyCPFRepetead(
      arrDados.id,
      arrDados.cpf
    );

    if (verifyCPF) {
      return res.status(400).json({
        error: true,
        msgUser: verifyCPF,
        msgOriginal: verifyCPF,
      });
    }

    try {
      await ticketRepository.putTicket(arrDados);
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser: "Ocorreu um erro ao atualizar ingresso.",
        msgOriginal: "Erro ao atualizar ingresso.",
      });
    }

    return res.status(200).json({
      error: false,
      msgUser: "Ingresso atualizado com sucesso.",
      msgOriginal: null,
    });
  }

  async getSearch(req, res) {
    let arrTickets = [];
    const startRow = req.query.start_row;
    const endRow = req.query.end_row;

    try {
      arrTickets = await ticketRepository.getSearch(
        req.query,
        startRow,
        endRow
      );
    } catch (error) {}

    return res.status(200).json({
      error: false,
      msgUser: null,
      msgOriginal: null,
      result: arrTickets,
    });
  }

  async activateTicket(req, res) {
    try {
      const id = req.params.id || req.body.id;

      const ticketExists = await ticketRepository.getTicket(id);

      if (!ticketExists) {
        return res.status(400).json({
          error: true,
          msgUser: "Ingresso não encontrado.",
          msgOriginal: "Ingresso nao encontrado.",
        });
      }

      await ticketRepository.updateStatusTicket(id, "A");

      return res.status(200).json({
        error: false,
        msgUser: "Ingresso validado com sucesso.",
        msgOriginal: null,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msgUser: "Ocorreu um erro ao ativar ingresso.",
        msgOriginal: "Erro ao ativar ingresso.",
      });
    }
  }
}

export default new ticketController();
