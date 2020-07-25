import { IUserDetail, createUsers, create, getUserForAuthorization, EUserRoles, 
  IUserForAuthorization} from './user.module';
import * as Bluebird from 'bluebird';
import { to } from '../../core/util/util';
const model = require('../../entities');
const { Op } = require("sequelize");

class User {

  constructor() {}

  public async create(user: IUserDetail): Promise<IUserDetail> {
    const [err, success] = await to<any>(model.User.create(user));

    if (err) {
      throw err
    }

    return create(success);
  }
  
  public getAll(): Bluebird<IUserDetail[]>{
    return model.User.findAll({
      order: ['name'],
      include: [{
        model: model.UserPreferenceFuel}]
    })
    .then(createUsers);
  }
  
  public async getById(id: number): Bluebird<IUserDetail>{
    let query = {};

    query['id'] = id;
    query['activate'] = true;

    const [err, success] = await to<any>(model.User.findOne({
      where: {
        [Op.and]: [query]
      },
      include: [
        { model: model.UserPreferenceFuel,
          include: { model: model.Fuel } }],
    }));

    if (err) {
      throw err;
    }

    return create(success);
  }

  public async getUserForAuthorization(email: string, username: string, id: number): 
    Promise<IUserForAuthorization> {
    const query = this.generateQueryByCredential(email, username, id);
    
    const [err, success] = await to<any>(model.User.findOne({
      where: {
        [Op.and]: [query]
      }
    }));

    if (err) {
      throw err;
    }

    return (getUserForAuthorization(success));
  }

  public async update(id: number, user: any, fields: string[]): Promise<IUserDetail>{
    let query = {};
  
    query['id'] = id;
    query['activate'] = true;

    const [err, success] = await to<any>(model.User.update(user, {
      where: {
        [Op.and]: [query]
      },
      fields: fields,
      hooks: true,
      individualHooks: true
    }));

    if (err) {
      throw err;
    }

    return create(success);
  }

  public async delete(id: number): Promise<IUserDetail>{
    const user = {
      id: id,
      activate: false
    }

    const[err, success] = await to<any>(model.User.update(user, {
      where: {id},
      fields: ['activate'],
      hooks: true,
      individualHooks: true
    }));

    if (err) {
      throw err
    }

    return (create(success));
  }

  public async readByEmailOrUsername(email: string, username: string): Promise<IUserDetail> {
    const query = this.generateQueryByCredential(email, username, null);

    const [err, success] = await to<any>(model.User.findOne({
      where: {
        [Op.and]: [query]
      }
    }));

    if (err) {
      throw (err);
    }

    if (success) {
      return (create(success));
    } else {
      throw {errors: [{message: 'User not found'}]};
    }
  }

  public async activateAccount(user: IUserForAuthorization): Promise<IUserDetail> {
    const keys = Object.keys(user)

    let query = {}
  
    user['activate'] = true;
    keys.forEach(property => {
      switch(property) {
        case 'email':
        case 'username':
            query[property] = user[property];
        break;
      }
    });

    user['date_acceptance_therms_use'] = new Date();
    query['activate'] = false;
    const [err, success] = await to<any>(model.User.update(user, {
        where: {
          [Op.and]: [query]
        },
        fields: ['activate', 'date_acceptance_therms_use'],
        hooks: true,
        individualHooks: true
      }));
    
      if (err) {
        throw new Error()  
      }
      
      return create(success);
  }

  public async verifyExistenceCredentials(username: string, email: string): Promise<Object> {
    const result = {email: 'free-to-use', username: 'free-to-use'}

    if (username) {
      const [err, amountUsername] = await to<any>(model.User.count({
        where: { username }
      }));

      if (amountUsername > 0) {
        result.username = 'in-use';
      }
    } else {
      delete result.username
    }

    if (email) {
      const [err, amountEmail] = await to<any>(model.User.count({
        where: { email }
      }));

      if (amountEmail > 0) {
        result.email = 'in-use';
      }
    } else {
      delete result.email
    }
    
    return result;
  }

  private generateQueryByCredential(email: string, username: string, id: number): object {
    let query = {};

    if (email) {
      query['email'] = email;
    }

    if (username) {
      query['username'] = username
    }

    if (id) {
      query['id'] = id;
    }

    query['activate'] = true;

    return query
  }
}

export default new User();
