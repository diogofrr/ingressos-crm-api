import ticketsUtils from "../Utils/ticketsUtils.js";
import ticketRepository from "../Repository/ticketRepository.js";
import pdfUtils from "../Utils/pdfUtils.js";

class ticketController {

    async postTicket(req, res)
    {
        const arrDados = await ticketsUtils.postNewTicket(req.body, req);
        
        try {
            await ticketRepository.postTicket(arrDados);
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Desculpe, ocorreu um erro ao tentar cadastrar o ingresso. Verifique se todas as informações estão corretas e tente novamente.',
                msgOriginal: 'Erro ao inserir ingresso na tabela tickets'
            });
        }

        return res.status(200).json({
            error: false,
            msgUser: 'Ingresso cadastrado com sucesso.',
            msgOriginal: null
        });
    }

    async getAllTickets(req, res) {
        const startRow = (req.body.start_row) ? req.body.start_row : 0;
        const endRow   = (req.body.end_row)   ? req.body.end_row   : 10; 
        let arrDados   = [];

        try {
            arrDados = await ticketRepository.getAllTickets(startRow, endRow);
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Desculpe, ocorreu um erro ao buscar ingressos. Tente novamente.',
                msgOriginal: 'Erro ao buscar ingressos.'
            });
        }

        return res.status(400).json({
            error: false,
            msgUser: null,
            msgOriginal: null,
            result: arrDados
        });
    }

    async teste() {
        await pdfUtils.testeCriacao();
    }
}

export default new ticketController();