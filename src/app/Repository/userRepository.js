import conexao from "../DataBase/conexao.js";

class userRepository {

    // login(cod_user, password)
    // {
    //     const sql = "SELECT id,nome,cod_user, perfil,cpf FROM funcionario where cod_user = ? and password =  md5(?)";
    
    //     return new Promise((resolve, reject) => {
    //         conexao.query(sql,[cod_user,password],(error, result) => {
    //             if (error) return reject(false);

    //             const row = JSON.parse(JSON.stringify(result));
    //             return resolve(row);
    //         })
    //     })
    // } 
    
    // putPassword(email,cpf, password)
    // {
    //     const sql = "UPDATE funcionario SET password = md5(?) WHERE email = ? and cpf = ?";

    //     return new Promise((resolve, reject) => {
    //         conexao.query(sql,[password, email,cpf],(error, result) => {
    //             if (error) return reject(false);

    //             const row = JSON.parse(JSON.stringify(result));
    //             return resolve(row);
    //         })
    //     })
    // }

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