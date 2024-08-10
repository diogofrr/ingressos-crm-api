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
        const sql = 'SELECT id, (SELECT full_name FROM users WHERE seller_id = id) seller, full_name, telephone, birth_date, cpf, qrcode, status, created_at, update_at, update_by FROM tickets ORDER BY full_name LIMIT ' + endRow + ' OFFSET ' + startRow;

        return new Promise((resolve, reject) => {
            conexao.query(sql,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

    async getTicket(id) {
        const sql = 'SELECT * FROM tickets WHERE = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,id,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

}
export default new ticketRepository();