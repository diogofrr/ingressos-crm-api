import mysql from "mysql2";
import "dotenv/config";

const config = {
  host: process.env.HOST,
  port: process.env.PORT_DB,
  user: process.env.USER,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
if (err) {
    console.log("Erro ao conectar ao MySQL:", err);
    setTimeout(handleDisconnect, 2000); // Tenta reconectar após 2 segundos
}
});

connection.on("error", (err) => {
if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Conexão perdida, reconectando...");
    handleDisconnect();
} else {
    throw err;
}
});

export default connection