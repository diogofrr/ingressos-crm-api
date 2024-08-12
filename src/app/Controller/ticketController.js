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

        const newPdf = await pdfUtils.createPDF(arrDados);

        return res.status(200).json({
            error: false,
            msgUser: 'Ingresso cadastrado com sucesso.',
            msgOriginal: null,
            pdf: newPdf
        });
    }

    async getAllTickets(req, res) {
        const startRow = (req.query.start_row) ? req.query.start_row : 0;
        const endRow   = (req.query.end_row)   ? req.query.end_row   : 10; 
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

        return res.status(200).json({
            error: false,
            msgUser: null,
            msgOriginal: null,
            result: arrDados
        });
    }

    async getTicket(req,res) {

        const id     = req.query.id;
        let arrDados = [];
        
        try {
            arrDados = await ticketRepository.getTicket(id);
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Desculpe, ocorreu um erro ao buscar ingresso. Tente novamente.',
                msgOriginal: 'Erro ao buscar ingressos.'
            });
        } 

        const pdf = await pdfUtils.createPDF(arrDados[0]);

        return res.status(200).json({
            error: false,
            msgUser: null,
            msgOriginal: null,
            pdf: pdf
        });
    }
}

export default new ticketController();