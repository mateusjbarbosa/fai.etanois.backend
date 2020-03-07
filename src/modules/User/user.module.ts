export enum EUserRoles {
  ADMIN = 'admin',
  DRIVER = 'driver',
  ATTENDANT = 'attendant',
  GAS_STATION_OWNER = 'gas_station_owner'
}

export interface IUser {
  readonly id: number,
  phone_number?: string,
  email?: string,
  name: string,
  password: string,
  cep: string,
  payment_mode: string,
  role?: EUserRoles
}

export interface IUserDetail {
  readonly id: number,
  phone_number: string,
  email: string,
  name: string,
  cep: string,
  payment_mode: string
}

export function create(user: any): IUserDetail {
  if (user) {
    const {id, phone_number, email, name, cep, payment_mode} = user;

    return {id, phone_number, email, name, cep, payment_mode};
  }

  return null
}

export function getUserForAuthorization({email, password, id, role}): any {
  return {email, password, id, role};
}

export function createUsers(data: any[]): IUserDetail[] {
  return data.map(create);
}