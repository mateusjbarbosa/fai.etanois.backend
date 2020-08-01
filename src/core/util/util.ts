import * as crypto from 'crypto'
import { trim } from 'lodash';

const cep_promise = require("cep-promise")

export interface ICep {
  cep: string,
  city: string,
  neighborhood: string,
  state: string,
  street: string
}

export const to = <T>(promise: Promise<T>): Promise<[Error | undefined, T]> =>
  promise
    .then<[undefined, T]>((res: T) => [undefined, res])
    .catch<[Error, any]>((err: Error) => [err, undefined]);

export function findWithAttr(array: any[], attr: string, value: any): number {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

export async function generateRadomToken(): Promise<string> {
  let token: string;

  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buffer) => {
      if (err) {
        reject(err)
        return;
      }

      resolve(buffer.toString('hex'))
    });
  });
}

export function onlyNumbers(str: string): string {
  if (str) {
    str = str.replace(/[^\d]+/g, '');
  }
  
  return str;
}

export function isCNPJ(cnpj: string): boolean {

  cnpj = onlyNumbers(cnpj);

  if (!cnpj) return false;

  if (cnpj.length != 14)
    return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999")
    return false;

  // Valida DVs
  let tamanho: number = cnpj.length - 2
  let numeros: string = cnpj.substring(0, tamanho);
  let digitos: string = cnpj.substring(tamanho);
  let soma: number = 0;
  let pos: number = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;

    if (pos < 2)
      pos = 9;
  }

  let resultado: number = soma % 11 < 2 ? 0 : 11 - soma % 11;

  if (resultado != Number(digitos.charAt(0)))
    return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;

    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

  if (resultado != Number(digitos.charAt(1)))
    return false;

  return true;
}

export async function isCEP(cep: string): Promise<ICep> {
  return new Promise(async (resolve, reject) => {
    onlyNumbers(cep);
    const [err, success] = await to<ICep>(cep_promise(cep));

    if (err) {
      reject(err)
    }

    resolve(success);
  });
}

export function trimAll(object: any): any {
  if (object) {
    Object.keys(object).forEach((key) => {
      let type = typeof object[key];

      if ("object" == type) {
        trimAll(object[key]);
      } else {
        object[key] = type == 'string' ? object[key].trim() : object[key]
      }
    });
  }

  return object;
}

export function validateHhMm(str: string): boolean {
  let is_valid: boolean = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(str);

  return is_valid;
}