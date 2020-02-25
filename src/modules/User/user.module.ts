export interface IUser {
  readonly id: number,
  phone_number: string,
  email: string,
  name: string,
  password: string,
  cep: string,
  payment_mode: string
}

export interface IUserDetail extends IUser {
  phone_number: string,
  email: string,
  name: string,
  password: string,
  cep: string,
  payment_mode: string
}

export function create(user: IUserDetail): IUserDetail {
  return user;
}

export function createUsers(data: any[]): IUserDetail[] {
  return data.map(create);
}