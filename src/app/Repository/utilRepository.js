import prisma from "../DataBase/conexao.js";

class utilRepository {
  async verifyEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? [user] : [];
  }

  async verifyCPF(cpf) {
    const ticket = await prisma.ticket.findFirst({ where: { cpf } });
    return ticket ? [ticket] : [];
  }

  async verifyTelephone(telefone) {
    const user = await prisma.user.findFirst({ where: { telephone } });
    return user ? [user] : [];
  }
}
export default new utilRepository();
