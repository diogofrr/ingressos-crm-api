import argon from "argon2";
import utilRepository from "../Repository/utilRepository.js";

class UserUtils {
  /**
   *
   * @param {*} nome
   * formata um nome
   * @returns
   */

  formatarNome(name) {
    const splittedName = name.split(" ");

    const formattedName = splittedName
      .map((name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      })
      .join(" ");

    return formattedName;
  }
  /**
   *
   * @param {*} cpf
   * formata um cpf
   * @returns
   */

  formatarCpf(cpf) {
    const formattedCpf = cpf.replace(/\D/g, "");

    const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
    return formattedCpf.replace(regex, "$1.$2.$3-$4");
  }

  /**
   *
   * @param {*} telefone
   * formata um numero de telefone
   * @returns
   */
  async formatarTelefone(telefone) {
    const formattedTelephone = telefone.replace(/\D/g, "");

    const regex = /^(\d{2})(\d{5})(\d{4})$/;
    return formattedTelephone.replace(regex, "($1) $2-$3");
  }

  /**
   *
   * @param {*} email
   * valida se um email é valido
   * @returns
   */
  emailValido(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async retornarArrayFormatado(dados) {
    const fullName = dados.full_name
      ? await this.formatarNome(dados.full_name)
      : "";
    const email = dados.email;
    const password = await argon.hash(dados.password);

    const data = { full_name: fullName, email, password };

    return data;
  }

  async RepeatedCPF(cpf) {
    try {
      const formattedCpf = this.formatarCpf(cpf);
      const ticket = await utilRepository.verifyCPF(formattedCpf);
      return ticket ? true : false;
    } catch (error) {
      return false;
    }
  }

  async RepeatedPhone(telephone) {
    try {
      const formattedTelephone = await this.formatarTelefone(telephone);
      const user = await utilRepository.verifyTelephone(formattedTelephone);
      return user ? true : false;
    } catch (error) {
      return false;
    }
  }

  async RepeatedEmail(email) {
    try {
      const user = await utilRepository.verifyEmail(email);
      return user ? true : false;
    } catch (error) {
      return false;
    }
  }
}

export default new UserUtils();
