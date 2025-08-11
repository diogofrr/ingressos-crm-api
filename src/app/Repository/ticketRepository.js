import prisma from "../DataBase/conexao.js";

class ticketRepository {
  async postTicket(dados) {
    const result = await prisma.ticket.create({ data: dados });
    return result;
  }

  async getAllTickets(startRow, endRow, query, tag) {
    const offset = Number(startRow) || 0;
    const limit = Number(endRow) - offset || 10;

    const where = query
      ? {
          ...(tag === "cpf"
            ? { cpf: { contains: String(query) } }
            : { full_name: { contains: String(query) } }),
        }
      : {};

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: [{ full_name: "asc" }, { id: "asc" }],
      skip: offset,
      take: limit,
      select: {
        id: true,
        full_name: true,
        telephone: true,
        birth_date: true,
        cpf: true,
        qrcode: true,
        status: true,
        created_at: true,
        update_at: true,
        update_by: true,
        seller: { select: { full_name: true } },
      },
    });

    return tickets;
  }

  async getAllTotal() {
    const total = await prisma.ticket.count();
    return total;
  }

  async getTicket(id) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    return ticket;
  }

  async getTicketHash(hash) {
    const ticket = await prisma.ticket.findFirst({
      where: { qrcode: String(hash) },
    });
    return ticket;
  }

  async updateStatusTicket(id, status) {
    const result = await prisma.ticket.update({
      where: { id },
      data: { status: String(status) },
    });
    return result;
  }

  async putTicket(dados) {
    const result = await prisma.ticket.update({
      where: { id: dados.id },
      data: {
        full_name: dados.full_name,
        telephone: dados.telephone,
        birth_date: dados.birth_date,
        cpf: dados.cpf,
        update_at: dados.update_at ? new Date(dados.update_at) : null,
        update_by: dados.update_by ?? null,
      },
    });
    return result;
  }

  async getSearch(dados, startRow, endRow) {
    const offset = Number(startRow) || 0;
    const limit = Number(endRow) - offset || 10;

    const rows = await prisma.ticket.findMany({
      where:
        dados.tag === "cpf"
          ? { cpf: { contains: String(dados.query) } }
          : { full_name: { contains: String(dados.query) } },
      orderBy: [{ full_name: "asc" }, { id: "asc" }],
      skip: offset,
      take: limit,
      select: {
        id: true,
        full_name: true,
        telephone: true,
        birth_date: true,
        cpf: true,
        qrcode: true,
        status: true,
        created_at: true,
        update_at: true,
        update_by: true,
        seller: { select: { full_name: true } },
      },
    });

    return rows.map((t) => ({
      id: t.id,
      seller: t.seller?.full_name ?? null,
      full_name: t.full_name,
      telephone: t.telephone,
      birth_date: t.birth_date,
      cpf: t.cpf,
      qrcode: t.qrcode,
      status: t.status,
      created_at: t.created_at,
      update_at: t.update_at,
      update_by: t.update_by,
    }));
  }

  async getAllTotalLike(query, tag) {
    const where =
      tag === "cpf"
        ? { cpf: { contains: String(query) } }
        : { full_name: { contains: String(query) } };
    const total = await prisma.ticket.count({ where });
    return [{ total }];
  }
}
export default new ticketRepository();
