import conexao from "../DataBase/conexao.js";

class ticketRepository {

    async postTicket(dados)
    {
        const sql = 'INSERT INTO tickets SET ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,dados,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

    async getAllTickets(startRow, endRow) {
        const sql = 'SELECT * FROM tickets ORDER BY full_name LIMIT ' + endRow + ' OFFSET ' + startRow;
        console.log(sql);

        return new Promise((resolve, reject) => {
            conexao.query(sql,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

}
export default new ticketRepository();