import userUtils from './userUtils.js';
import bcrypt from 'bcrypt';
import jwtUtils from './jwtUtils.js';

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
}

export default new ticketsUtils();