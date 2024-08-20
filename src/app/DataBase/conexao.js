import mysql from 'mysql2';
import 'dotenv/config';

const conexao = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
    connectionLimit: 10,
    queueLimit: 0
});
 
conexao.connect();

export default conexao;