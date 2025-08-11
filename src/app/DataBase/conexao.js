import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Fallback: monta DATABASE_URL com base nas variáveis já usadas no projeto
if (!process.env.DATABASE_URL) {
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT_DB || "3306";
  const user = process.env.DB_USER || process.env.USER || "root";
  const password = process.env.PASSWORD_DB || "";
  const database = process.env.DATABASE || "";
  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(password);
  // Se não houver senha, remove os dois pontos
  const auth = password ? `${encodedUser}:${encodedPass}` : `${encodedUser}`;
  process.env.DATABASE_URL = `mysql://${auth}@${host}:${port}/${database}`;
}

const prisma = new PrismaClient();

export default prisma;
