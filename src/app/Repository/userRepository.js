import prisma from "../DataBase/conexao.js";

class userRepository {
  async postUser(dados) {
    const result = await prisma.user.create({ data: dados });
    return result;
  }

  async passwordRecovery(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, full_name: true, password: true },
    });
    return user ? [user] : [];
  }
}
export default new userRepository();
