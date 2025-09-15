import bcrypt from "bcrypt";
import moment from "moment";
import ticketRepository from "../Repository/ticketRepository.js";
import jwtUtils from "./jwtUtils.js";
import userUtils from "./userUtils.js";

class ticketsUtils {
  /**
   * gera um numero de prontuario
   * @returns
   */
  async generateQrCode(cpf) {
    return await bcrypt.hash(cpf, 10);
  }

  async postNewTicket(dados, req) {
    const sellerId = await jwtUtils.idRecovery(req);
    const fullName = dados.full_name
      ? await userUtils.formatarNome(dados.full_name)
      : "";
    const telephone = dados.telephone
      ? await userUtils.formatarTelefone(dados.telephone)
      : "";
    const birthDate = dados.birth_date ? dados.birth_date : "";
    const cpf = dados.cpf ? await userUtils.formatarCpf(dados.cpf) : "";
    const qrcode = await this.generateQrCode(dados.cpf);

    const arrDados = {
      seller_id: sellerId,
      full_name: fullName,
      telephone: telephone,
      birth_date: birthDate,
      cpf: cpf,
      qrcode: qrcode,
      status: "A",
      batch: dados.batch,
    };

    return arrDados;
  }

  async putTicket(dados, req) {
    const fullName = dados.full_name
      ? await userUtils.formatarNome(dados.full_name)
      : "";
    const telephone = dados.telephone
      ? await userUtils.formatarTelefone(dados.telephone)
      : "";
    const birthDate = dados.birth_date ? dados.birth_date : "";
    const cpf = dados.cpf ? await userUtils.formatarCpf(dados.cpf) : "";
    const dateUp = moment().toDate();
    const sellerId = await jwtUtils.idRecovery(req);

    const arrDados = {
      id: dados.id,
      full_name: fullName,
      telephone: telephone,
      birth_date: birthDate,
      cpf: cpf,
      update_at: dateUp,
      update_by: sellerId,
      batch: dados.batch,
    };

    return arrDados;
  }

  async verifyCPFRepetead(id, cpf) {
    const arrTicket = await ticketRepository.getTicket(id);
    let msg = "";

    if (!arrTicket) {
      msg = "Ingresso não encontrado, Por Favor, tente novamente.";
    } else {
      if (arrTicket.cpf != cpf) {
        if (await userUtils.RepeatedCPF(cpf)) {
          msg =
            "Desculpe, o CPF fornecido já está associado a um ingresso existente.";
        }
      }
    }

    return msg;
  }

  getEventInfo() {
    return {
      title: "SAMBA DO SEU ZÉ",
      date: "11/10/2025",
      time: "16H ÀS 00H",
      addressLine1: "R. QUINTINO BOCAIÚVA, 2607 - SARAIVA",
      addressLine2: "UBERLÂNDIA/MG",
    };
  }
}

export default new ticketsUtils();
