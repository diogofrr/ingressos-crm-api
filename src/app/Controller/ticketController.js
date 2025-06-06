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
                msgUser: 'Ocorreu um erro ao tentar cadastrar o ingresso. Verifique as informações e tente novamente.',
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
        const query    = (req.query.query)     ? req.query.query     : '';
        const tag      = (req.query.tag)       ? req.query.tag       : '';
        let arrDados   = [];

        try {
            arrDados = await ticketRepository.getAllTickets(startRow, endRow, query, tag);
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao buscar ingressos.',
                msgOriginal: 'Erro ao buscar ingressos.'
            });
        }

        const total = (!query) ? await ticketRepository.getAllTotal() : await ticketRepository.getAllTotalLike(query, tag);

        return res.status(200).json({
            error: false,
            msgUser: null,
            msgOriginal: null,
            result: {
                total: total[0].total,
                tickets : arrDados
            }
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
                msgUser: 'Ocorreu um erro ao buscar ingresso.',
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

    async validate(req, res) {
        let arrTicket = [];
        let verify    = false;

        try {
            arrTicket = await ticketRepository.getTicketHash(req.body.hash);
            verify    = (!arrTicket[0]) ? true : false;
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao validar ingresso.',
                msgOriginal: 'Erro ao validar ingresso.'
            });
        }

        if (verify) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao validar ingresso.',
                msgOriginal: 'Retorno vazio.'
            });
        }

        if (arrTicket[0].status != 'A') {
            const motivo = (arrTicket[0].status == 'C') ? 'cancelado.' : 'utilizado.';

            return res.status(400).json({
                error: true,
                msgUser: 'O ingresso já foi ' + motivo,
                msgOriginal: 'Retorno vazio.'
            });
        }

        try {
            await ticketRepository.updateStatusTicket(arrTicket[0].id, 'U');
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao validar ingresso.',
                msgOriginal: 'Erro ao validar ingresso.'
            });
        }

        return res.status(200).json({
            error: false,
            msgUser: 'Ingresso validado com sucesso.',
            msgOriginal: null
        });
    }

    async delTicket(req, res) {
        const id   = req.body.id;
        let verify = false;

        try {
            const arrResult = await ticketRepository.updateStatusTicket(id, 'C');
            verify          = (arrResult.affectedRows != 0) ? false : true;
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao deletar ingresso.',
                msgOriginal: 'Erro ao cancelar ingresso.'
            });
        }

        if (verify) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ingresso não encontrado.',
                msgOriginal: 'Ingresso nao encontrado.'
            });
        }

        return res.status(200).json({
            error: false,
            msgUser: 'Ingresso cancelado com sucesso.',
            msgOriginal: null
        });
    }

    async putTicket(req, res) {
        const arrDados  = await ticketsUtils.putTicket(req.body, req);
        const verifyCPF = await ticketsUtils.verifyCPFRepetead(arrDados.id, arrDados.cpf);

        if (verifyCPF) {
            return res.status(400).json({
                error: true,
                msgUser: verifyCPF,
                msgOriginal: verifyCPF
            });
        }

        try {
            await ticketRepository.putTicket(arrDados);
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao atualizar ingresso.',
                msgOriginal: 'Erro ao atualizar ingresso.'
            });
        }
        
        return res.status(200).json({
            error: false,
            msgUser: 'Ingresso atualizado com sucesso.',
            msgOriginal: null
        });
    }

    async getSearch(req, res) {

        let arrTickets = [];
        const startRow = req.query.start_row;
        const endRow = req.query.end_row;

        try {
            arrTickets = await ticketRepository.getSearch(req.query, startRow, endRow);
        } catch(error) {

        }
        
        return res.status(200).json({
            error: false,
            msgUser: null,
            msgOriginal: null,
            result: arrTickets
        });
    }

    async aticvateTicket(req, res) {
        const id   = req.body.id;
        let verify = false;

        try {
            const arrResult = await ticketRepository.updateStatusTicket(id, 'A');
            verify          = (arrResult.affectedRows != 0) ? false : true;
        } catch (error) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ocorreu um erro ao ativar ingresso.',
                msgOriginal: 'Erro ao ativar ingresso.'
            });
        }

        if (verify) {
            return res.status(400).json({
                error: true,
                msgUser: 'Ingresso não encontrado.',
                msgOriginal: 'Ingresso nao encontrado.'
            });
        }

        return res.status(200).json({
            error: false,
            msgUser: 'Ingresso ativado com sucesso.',
            msgOriginal: null
        });
    }
}

export default new ticketController();