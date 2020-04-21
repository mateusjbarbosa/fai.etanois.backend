import * as crypto from 'crypto'
import Redis from '../../core/redis/redis';
import Nodemailer from '../../core/nodemailer/nodemailer';

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
  username: string[12],
  email: string,
  name: string,
  password: string,
  cep: string,
  search_distance_with_route: number,
  search_distance_without_route: number,
  payment_mode: EPaymentMode,
  etacoins?: number
  role?: EUserRoles,
  UserPreferenceFuels?: IUserPreferenceFuel[]
}

export interface IUserDetail {
  readonly id: number,
  username: string[12],
  email: string,
  name: string,
  cep: string,
  payment_mode: string,
  search_distance_with_route: number,
  search_distance_without_route: number,
  etacoins?: number
  UserPreferenceFuels?: IUserPreferenceFuel[]
}

export interface IUserPreferenceFuel {
  fuel_name: string
}

export interface IUserForAuthorization {
  id: number,
  username: string[12],
  email: string,
  password: string,
  role: EUserRoles
}

export function create(user: any): IUserDetail {
  let userObject:any = null;

  try{
    if (user.dataValues.hasOwnProperty('id')) { // User generated by read
      userObject = user;
    }
  } catch(err) {
    if (user[1][0].dataValues.hasOwnProperty('id')) { // User generated by update
      userObject = user[1][0].dataValues;
    }
  }
  
  if (userObject) {
    let {id, search_distance_with_route, search_distance_without_route, username, email, name,
      cep, payment_mode, etacoins, UserPreferenceFuels} = userObject;
      
      if (UserPreferenceFuels) {
        UserPreferenceFuels.forEach(item => {
          delete item.dataValues.id
          delete item.dataValues.user_id
          delete item.dataValues.createdAt
          delete item.dataValues.updatedAt
        })
      }

      search_distance_with_route = parseInt(search_distance_with_route)
      search_distance_without_route = parseInt(search_distance_without_route)
      
    return {id, username, email, name, cep, payment_mode, search_distance_with_route, etacoins,
      search_distance_without_route, UserPreferenceFuels};
  }

  return null
}

export function getUserForAuthorization(user: any): IUserForAuthorization {
  let userAuthoriation: IUserForAuthorization = {
    id: null,
    email: null,
    username: null,
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

        case 'username':
          userAuthoriation.username = user[property];
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

export async function generateRandomToken(user: any): Promise<any> {
  if (user) {
    const { id, email } = user;

    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buffer) => {
        const token = buffer.toString('hex')
        const redis = new Redis();
  
        redis.createRecoverPassword(token, id)
        Nodemailer.sendEmail(email, token)
        .then(message => { resolve({msg: 'Email sent'}) })
        .catch (err => { reject(); })
      });
    })
  } else {
    throw new Error('User not found').message;
  }
}