import UserUtils from "../Utils/userUtils.js";

class ticketRequest {
  async postTicket(req, res, next) {
    let msg = "";

    if (!req.body.cpf) {
      msg = "Parametro cpf é obrigatorio.";
    }

    if (!req.body.birth_date) {
      msg = "Parametro birth_date é obrigatorio.";
    }

    if (!req.body.telephone) {
      msg = "Parametro telephone é obrigatorio.";
    }

    if (!req.body.full_name) {
      msg = "Parametro full_name é obrigatorio.";
    }

    if (msg) {
      return res.status(422).json({
        error: true,
        msgUser: msg,
        msgOriginal: msg,
      });
    }

    if (await UserUtils.RepeatedCPF(req.body.cpf)) {
      return res.status(400).json({
        error: true,
        msgUser: "O CPF fornecido já está associado a um ingresso existente.",
        msgOriginal: "Cpf já consta na base de dados.",
      });
    }

    next();
  }

  async getTicket(req, res, next) {
    let msg = "";

    const id = req.params.id || req.query.id;
    if (!id) {
      msg = "Parametro id é obrigatorio.";
    }

    if (msg) {
      return res.status(422).json({
        error: true,
        msgUser: msg,
        msgOriginal: msg,
      });
    }

    next();
  }

  async validate(req, res, next) {
    let msg = "";

    if (!req.body.hash) {
      msg = "Parametro hash é obrigatorio.";
    }

    if (msg) {
      return res.status(422).json({
        error: true,
        msgUser: msg,
        msgOriginal: msg,
      });
    }

    next();
  }

  async delTicket(req, res, next) {
    let msg = "";

    if (!req.params.id && !req.body.id) {
      msg = "Parametro id é obrigatorio.";
    }

    if (msg) {
      return res.status(422).json({
        error: true,
        msgUser: msg,
        msgOriginal: msg,
      });
    }

    next();
  }

  async putTicket(req, res, next) {
    let msg = "";

    if (!req.body.cpf) {
      msg = "Parametro cpf é obrigatorio.";
    }

    if (!req.body.birth_date) {
      msg = "Parametro birth_date é obrigatorio.";
    }

    if (!req.body.telephone) {
      msg = "Parametro telephone é obrigatorio.";
    }

    if (!req.body.full_name) {
      msg = "Parametro full_name é obrigatorio.";
    }

    if (!req.params.id && !req.body.id) {
      msg = "Parametro id é obrigatorio.";
    }

    if (msg) {
      return res.status(422).json({
        error: true,
        msgUser: msg,
        msgOriginal: msg,
      });
    }

    next();
  }

  async activateTicket(req, res, next) {
    let msg = "";

    if (!req.params.id && !req.body.id) {
      msg = "Parametro id é obrigatorio.";
    }

    if (msg) {
      return res.status(400).json({
        error: true,
        msgUser: msg,
        msgOriginal: msg,
      });
    }

    next();
  }
}

export default new ticketRequest();
