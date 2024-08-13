import userUtils from './userUtils.js';
import bcrypt from 'bcrypt';
import jwtUtils from './jwtUtils.js';
import ticketRepository from '../Repository/ticketRepository.js';
import moment from 'moment';

class ticketsUtils {

    /**
     * gera um numero de prontuario
     * @returns 
     */
    async generateQrCode(cpf)
    {
        return await bcrypt.hash(cpf, 10);
    }

    async postNewTicket(dados, req)
    {
        const sellerId  = await jwtUtils.idRecovery(req);
        const fullName  = (dados.full_name) ? await userUtils.formatarNome(dados.full_name) : '';
        const telephone = (dados.telephone) ? await userUtils.formatarTelefone(dados.telephone) : ''
        const birthDate = (dados.birth_date) ? dados.birth_date : ''; 
        const cpf       = (dados.cpf) ? await userUtils.formatarCpf(dados.cpf) : '';
        const qrcode    = await this.generateQrCode(dados.cpf);

        const arrDados = {seller_id: sellerId, full_name: fullName, telephone: telephone, birth_date: birthDate, cpf: cpf, qrcode: qrcode, status: 'A'};

        return arrDados;
    }

    async putTicket(dados, req) {
        const fullName  = (dados.full_name) ? await userUtils.formatarNome(dados.full_name) : '';
        const telephone = (dados.telephone) ? await userUtils.formatarTelefone(dados.telephone) : ''
        const birthDate = (dados.birth_date) ? dados.birth_date : ''; 
        const cpf       = (dados.cpf) ? await userUtils.formatarCpf(dados.cpf) : '';
        const dateUp    = moment().format('YYYY-MM-DD');
        const sellerId  = await jwtUtils.idRecovery(req);

        const arrDados = {id: dados.id, full_name: fullName, telephone: telephone, birth_date: birthDate, cpf: cpf, update_at: dateUp, update_by: sellerId};

        return arrDados;
    }

    async verifyCPFRepetead(id, cpf) {
        const arrTicket = await ticketRepository.getTicket(id);
        let msg      = '';

        if (!arrTicket[0]) {
            msg = 'Ingresso nao encontrado, Por Favor, tente novamente.';
        } else {
            if (arrTicket[0].cpf != cpf) {
                if(await userUtils.RepeatedCPF(cpf)) {
                    msg = 'Desculpe, o cpf fornecido já está associado a um ingresso existente.';
                }
            }
        }

        return msg;
    }
}

export default new ticketsUtils();