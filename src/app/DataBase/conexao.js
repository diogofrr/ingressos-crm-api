import mysql from "mysql2";
import "dotenv/config";

const config = {
  host: process.env.HOST,
  port: process.env.PORT_DB,
  user: process.env.USER,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  connectTimeout: 10000, // 10 segundos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error("Conexão recusada pelo servidor. Verifique se o MySQL está ativo e a configuração está correta.");
        setTimeout(handleDisconnect, 5000); // Tenta reconectar após 5 segundos
      } else {
        console.error("Erro ao conectar ao MySQL:", err);
        setTimeout(handleDisconnect, 2000); // Tenta reconectar após 2 segundos
      }
    } else {
      console.log("Conectado ao MySQL!");
    }
  });

  connection.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Conexão perdida, reconectando...");
      handleDisconnect();
    } else if (err.code === 'ECONNREFUSED') {
      console.error("Conexão recusada pelo servidor. Tentando reconectar...");
      setTimeout(handleDisconnect, 5000); // Tenta reconectar após 5 segundos
    } else {
      console.error("A conexão falhou:", err);
      throw err; // Relança o erro se não for uma desconexão esperada
    }
  });

  // Mantém a conexão ativa enviando consultas "keep-alive" a cada 1 hora
  setInterval(() => {
    if (connection && connection.state !== 'disconnected') {
      connection.query('SELECT 1', (err) => {
        if (err) console.error("Erro ao enviar keep-alive query:", err);
      });
    } else {
      console.log("Tentativa de enviar keep-alive, mas a conexão está fechada.");
    }
  }, 60 * 60 * 1000); // 1 hora

  return connection;
}

const conexao = handleDisconnect();

export default conexao;
