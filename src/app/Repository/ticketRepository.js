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

    async getAllTotal() {
        const sql = 'SELECT COUNT(*) total FROM tickets';

        return new Promise((resolve, reject) => {
            conexao.query(sql,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

    async getTicket(id) {
        const sql = 'SELECT * FROM tickets WHERE id = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,id,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

    async getTicketHash(hash) {
        const sql = 'SELECT * FROM tickets WHERE qrcode = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,hash,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);    
            });
        });
    }

    async updateStatusTicket(id, status)
    {
        const sql = 'UPDATE tickets SET status = ? WHERE id = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,[status, id],(error, result) => {
                console.log(error);
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

    async putTicket(dados) {
        const sql = 'UPDATE tickets SET full_name = ?, telephone = ?, birth_date = ?, cpf = ?, update_at = ?, update_by = ? WHERE id = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,[dados.full_name, dados.telephone, dados.birth_date, dados.cpf, dados.update_at, dados.update_by ,dados.id],(error, result) => {
                console.log(error);
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

    async getSearch(dados) {

        const field = (dados.tag == 'cpf') ? 'cpf' : 'full_name';
        const sql   = "SELECT * FROM tickets WHERE " + field + " LIKE '%" + dados.query + "%'";

        return new Promise((resolve, reject) => {
            conexao.query(sql,(error, result) => {
                console.log(error);
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

}
export default new ticketRepository();