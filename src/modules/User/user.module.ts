export interface IUser {
  readonly id: number,
  phone_number: string,
  email: string,
  name: string,
  password: string,
  cep: string,
  payment_mode: string
}

export interface IUserDetail {
  readonly id: number,
  phone_number: string,
  email: string,
  name: string,
  cep: string,
  payment_mode: string
}

export function create({id, phone_number, email, name, cep, payment_mode}): IUserDetail {
  return {id, phone_number, email, name, cep, payment_mode};
}

export function getUserForAuthorization({password, id}): any {
  return {password, id};
}

export function createUsers(data: any[]): IUserDetail[] {
  return data.map(create);
}