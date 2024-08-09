import conexao from "../DataBase/conexao.js";

class utilRepository {

    async verifyEmail(email)
    {
        const sql = 'SELECT * FROM users WHERE email = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,email,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

    async verifyCPF(cpf)
    {
        const sql = 'SELECT * FROM users WHERE cpf = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,cpf,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

    async verifyTelephone(telefone)
    {
        const sql = 'SELECT * FROM users WHERE telephone = ?';

        return new Promise((resolve, reject) => {
            conexao.query(sql,telefone,(error, result) => {
                console.log(error);
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            });
        });
    }

}
export default new utilRepository();