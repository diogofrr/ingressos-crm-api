import UserUtils from "../Utils/userUtils.js";

class ticketRequest {

    async postTicket(req, res, next)
    {
        let msg = '';

        if (!req.body.cpf) {
            msg = 'Parametro cpf é obrigatorio.';
        }

        if (!req.body.birth_date) {
            msg = 'Parametro birth_date é obrigatorio.';
        }

        if (!req.body.telephone) {
            msg = 'Parametro telephone é obrigatorio.';
        }

        if (!req.body.full_name) {
            msg = 'Parametro full_name é obrigatorio.';
        }

        if(msg) {
            return res.status(400).json({
                error: true,
                msgUser: msg,
                msgOriginal: msg
            });
        }

        if (await UserUtils.RepeatedCPF(req.body.cpf)) {
            return res.status(400).json({
                error: true,
                msgUser: 'Desculpe, o cpf fornecido já está associado a um ingresso existente.',
                msgOriginal: 'Cpf já consta na base de dados.'
            });
        }

        next();
    }

    async getTicket(req, res, next)
    {
        let msg = '';

        if (!req.query.id) {
            msg = 'Parametro id é obrigatorio.';
        }

        if(msg) {
            return res.status(400).json({
                error: true,
                msgUser: msg,
                msgOriginal: msg
            });
        }

        next();
    }
}

export default new ticketRequest();