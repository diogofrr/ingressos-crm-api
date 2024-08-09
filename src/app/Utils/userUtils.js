// import PacienteRepository from "../Repositories/PacienteRepository.js";
import utilRepository from "../Repository/utilRepository.js";
import argon from 'argon2';
// import mysql from 'mysql';

class UserUtils {

    /**
     * 
     * @param {*} nome 
     * formata um nome
     * @returns 
     */

    formatarNome(nome)
    {
        const arrNome = nome.split(' ');
        for (let i = 0; i < arrNome.length; i++) {
            arrNome[i] = arrNome[i].charAt(0).toUpperCase() + arrNome[i].slice(1);
        }

        return arrNome.join(' ');
    }
    /**
     * 
     * @param {*} cpf 
     * formata um cpf
     * @returns 
     */

    formatarCpf(cpf)
    {
        const cpfLimpo = cpf.replace(/\D/g, '');

        const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
        return cpfLimpo.replace(regex, '$1.$2.$3-$4');
    }

    /**
     * 
     * @param {*} telefone 
     * formata um numero de telefone
     * @returns 
     */
    async formatarTelefone(telefone) {
        const telefoneLimpo = telefone.replace(/\D/g, '');

        const regex = /^(\d{2})(\d{5})(\d{4})$/;
        return telefoneLimpo.replace(regex, '($1) $2-$3');
    }

    /**
     * 
     * @param {*} email 
     * valida se um email é valido
     * @returns 
     */
    emailValido(email)
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

     

    async retornarArrayFormatado(dados)
    {
        const fullName  = (dados.full_name) ? await this.formatarNome(dados.full_name) : '';
        const email     = dados.email;
        const password  = await argon.hash(dados.password);

        const arrDados = {full_name: fullName, email: email, password: password};

        return arrDados;
    }

    // async retornarArrayFormatadoSemPt(dados)
    // {
    //     const nome     = (dados.nome) ? this.formatarNome(dados.nome) : '';
    //     const cpf      = (dados.cpf) ? this.formatarCpf(dados.cpf) : '';
    //     const dataNasc = dados.data_nasc;
    //     const email    = dados.email;
    //     const telefone = (dados.telefone) ? this.formatarTelefone(dados.telefone) : '';
    //     const endereco = dados.endereco;

    //     const arrDados = {nome: nome, cpf: cpf, dataNasc: dataNasc, email: email, telefone: telefone, endereco: endereco};

    //     return arrDados;
    // }
    
    async RepeatedCPF(cpf)
      {
            const cpfF = this.formatarCpf(cpf);
            let verify = false;

            try {
                const arrDados = await utilRepository.verifyCPF(cpfF);
                verify         = (arrDados[0]) ? true : false;
            } catch(error) {
                return false;
            }

            return verify;
      }

      async RepeatedPhone(telefone)
      {
            const telefoneF = await this.formatarTelefone(telefone);
            let verify      = false;

            try {
                const arrDados = await utilRepository.verifyTelephone(telefoneF);
                verify         = (arrDados[0]) ? true : false;

            } catch(error) {
                return false;
            }

            return verify;
      }

      async RepeatedEmail(email)
      {
            let verify = false;

            try {

                const arrDados = await utilRepository.verifyEmail(email);
                verify         = (arrDados[0]) ? true : false;

            } catch(error) {
                return false;
            }

            return verify;
      }
}

export default new UserUtils();