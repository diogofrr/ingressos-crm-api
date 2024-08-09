import UserUtils from "../Utils/userUtils.js";

class userRequest {

    // login(req, res, next)
    // {
    //     let msg = '';

    //     if (!req.body.cod_user) {
    //         msg = 'Parametro cod_user é obrigatorio.';
    //     }

    //     if (!req.body.password) {
    //         msg = 'Parametro password é obrigatorio.';
    //     }

    //     if(msg) {
    //         return res.status(400).json({
    //             error: true,
    //             msgUser: msg,
    //             msgOriginal: msg
    //         });
    //     }

    //     next();
    // }

    // putPassword(req, res, next)
    // {
    //     let msg = '';

    //     if (!req.body.email) {
    //         msg = 'Parametro email é obrigatorio.';
    //     }

    //     if (!req.body.cpf) {
    //         msg = 'Parametro cpf é obrigatorio.';
    //     }

    //     if (!req.body.password) {
    //         msg = 'Parametro password é obrigatorio.';
    //     }

    //     if(msg) {
    //         return res.status(400).json({
    //             error: true,
    //             msgUser: msg,
    //             msgOriginal: msg
    //         });
    //     }

    //     if (!UserUtils.emailValido(req.body.email)) {
    //         return res.status(400).json({
    //             error: true,
    //             msgUser: 'Email inválido, informe um email valido',
    //             msgOriginal: 'Email inválido, informe um email valido'
    //         });
    //     }

    //     next();
    // }

    async postUser(req, res, next)
    {
        let msg = '';

        if (!req.body.password) {
            msg = 'Parametro password é obrigatorio.';
        }

        if (!req.body.email) {
            msg = 'Parametro email é obrigatorio.';
        }

        if (!req.body.full_name) {
            msg = 'Parametro nome é obrigatorio.';
        }

        if(msg) {
            return res.status(400).json({
                error: true,
                msgUser: msg,
                msgOriginal: msg
            });
        }

        if (!UserUtils.emailValido(req.body.email)) {
            return res.status(400).json({
                error: true,
                msgUser: 'Email inválido, informe um email valido',
                msgOriginal: 'Email inválido, informe um email valido'
            });
        }

        if (await UserUtils.RepeatedEmail(req.body.email)) {
            return res.status(400).json({
                error: true,
                msgUser: 'Desculpe, o e-mail fornecido já está associado a um cadastro existente. Se deseja cadastrar um novo usuário, por favor, utilize um endereço de e-mail diferente ou entre em contato conosco para obter assistência.',
                msgOriginal: 'Email já consta na base de dados.'
            });
        }

        next();
    }

    async postLogin(req, res, next) {

        let msg = '';

        if (!req.body.password) {
            msg = 'Parametro password é obrigatorio.';
        }

        if (!req.body.email) {
            msg = 'Parametro email é obrigatorio.';
        }

        if(msg) {
            return res.status(400).json({
                error: true,
                msgUser: msg,
                msgOriginal: msg
            });
        }

        if (!UserUtils.emailValido(req.body.email)) {
            return res.status(400).json({
                error: true,
                msgUser: 'Email inválido, informe um email valido',
                msgOriginal: 'Email inválido, informe um email valido'
            });
        }

        next();
    }
}

export default new userRequest();