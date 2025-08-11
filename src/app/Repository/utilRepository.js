import prisma from "../DataBase/conexao.js";

class utilRepository {
  async verifyEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async verifyCPF(cpf) {
    const ticket = await prisma.ticket.findFirst({ where: { cpf } });
    return ticket;
  }

  async verifyTelephone(telephone) {
    const user = await prisma.user.findFirst({ where: { telephone } });
    return user;
  }
}
export default new utilRepository();
