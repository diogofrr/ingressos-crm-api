import conexao from "../DataBase/conexao.js";

class userRepository {

    postUser(dados) {

        const sql = "INSERT INTO users SET ?";

        return new Promise((resolve, reject) => {
            conexao.query(sql,dados,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            })
        })
    }

    passwordRecovery(email) {
        const sql = "SELECT id, full_name, password FROM users WHERE email = ?";

        return new Promise((resolve, reject) => {
            conexao.query(sql,email,(error, result) => {
                if (error) return reject(false);

                const row = JSON.parse(JSON.stringify(result));
                return resolve(row);
            })
        })
    }
}
export default new userRepository();