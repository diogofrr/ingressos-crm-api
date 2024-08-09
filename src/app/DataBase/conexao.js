import mysql from 'mysql';
import 'dotenv/config';

const conexao = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE
});
 
conexao.connect();

export default conexao;