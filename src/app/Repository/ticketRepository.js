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

    async getAllTickets(startRow, endRow, query, tag) {
        let tr = '';
        if (tag) {
            const field = (tag === 'cpf') ? 'cpf' : 'full_name';
            tr          = (field == 'cpf') ? " WHERE t.cpf LIKE '%" + query + "%'" : " WHERE t.full_name LIKE '%" + query + "%'" ;
        }
        console
        const sql = 'WITH OrderedTickets AS ('
           + 'SELECT t.id, ' 
           + 'u.full_name AS seller,' 
           + 't.full_name,' 
           + 't.telephone,' 
           + 't.birth_date,' 
           + 't.cpf,' 
           + 't.qrcode,' 
           + 't.status,' 
           + 't.created_at,' 
           + 't.update_at,' 
           + 't.update_by,'
           + 'ROW_NUMBER() OVER (ORDER BY t.full_name, t.id) AS row_num'
      + ' FROM tickets t'
      + ' LEFT JOIN users u ON u.id = t.seller_id'
      + tr 
        +')'
        + ' SELECT id, seller, full_name, telephone, birth_date, cpf, qrcode, status, created_at, update_at, update_by'
        + ' FROM OrderedTickets'
        + ' WHERE row_num > ' + startRow
        + ' AND row_num <= ' + endRow
        + ' ORDER BY row_num';

        console.log(sql);

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
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

    async getSearch(dados, startRow, endRow) {
        const field = (dados.tag === 'cpf') ? 'cpf' : 'full_name';
        const sql = `
            WITH FilteredTickets AS (
                SELECT t.id, 
                       u.full_name AS seller, 
                       t.full_name, 
                       t.telephone, 
                       t.birth_date, 
                       t.cpf, 
                       t.qrcode, 
                       t.status, 
                       t.created_at, 
                       t.update_at, 
                       t.update_by,
                       ROW_NUMBER() OVER (ORDER BY t.full_name, t.id) AS row_num
                  FROM tickets t
                  LEFT JOIN users u ON u.id = t.seller_id
                 WHERE t.${field} LIKE '%${dados.query}%'
            )
            SELECT id, seller, full_name, telephone, birth_date, cpf, qrcode, status, created_at, update_at, update_by
              FROM FilteredTickets
             WHERE row_num > '%${startRow}%'
               AND row_num <= '%${endRow}%'
             ORDER BY row_num;
        `;
    
        return new Promise((resolve, reject) => {
            conexao.query(sql, (error, result) => {
                if (error) return reject(false);
    
                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

}
export default new ticketRepository();