export enum EUserRoles {
  ADMIN = 'admin',
  DRIVER = 'driver',
  ATTENDANT = 'attendant',
  GAS_STATION_OWNER = 'gas_station_owner'
}

export enum EPaymentMode {
  BOTH = 'both',
  MONEY = 'money',
  CREDIT_CARD = 'credit_card'
}

export interface IUser {
  readonly id: number,
  phone_number?: string,
  email?: string,
  name: string,
  password: string,
  cep: string,
  search_distance: number,
  payment_mode: EPaymentMode,
  role?: EUserRoles
}

export interface IUserDetail {
  readonly id: number,
  phone_number: string,
  email: string,
  name: string,
  cep: string,
  payment_mode: string,
  search_distance: number
}

export interface IUserForAuthorization {
  id: number,
  phone_number?: string,
  email?: string,
  password: string,
  role: EUserRoles
}

export function create(user: any): IUserDetail {
  if (user) {
    const {id, search_distance, phone_number, email, name, cep, payment_mode} = user;

    return {id, phone_number, email, name, cep, payment_mode, search_distance};
  }

  return null
}

export function getUserForAuthorization(user: any): IUserForAuthorization {
  let userAuthoriation: IUserForAuthorization = {
    id: null,
    email: null,
    phone_number: null,
    password: null,
    role: null
  };

  if (user) {
    const keys = Object.keys(user._previousDataValues);

    keys.forEach(property => {
      switch (property)
      {
        case 'id':
          userAuthoriation.id = user[property];
        break;

        case 'phone_number':
          userAuthoriation.phone_number = user[property];
        break;

        case 'email':
          userAuthoriation.email = user[property];
        break;

        case 'role':
          userAuthoriation.role = user[property];
        break;

        case 'password':
          userAuthoriation.password = user[property];
        break;
      }
    });

    return userAuthoriation;
  }

  return null;
}

export function createUsers(data: any[]): IUserDetail[] {
  return data.map(create);
}