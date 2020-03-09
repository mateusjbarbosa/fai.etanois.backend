import { IUser, IUserDetail, createUsers, create, getUserForAuthorization, IUserForAuthorization } from './user.module';
import * as Bluebird from 'bluebird';
const model = require('../../entities');
const { Op } = require("sequelize");

class User {

  constructor() {}

  create(user: any): Promise<any>{
    if (user.phone_number || user.email) {
      return model.User.create(user);
    } else {
      throw new Error('Phone number or email is required').message;
    }
  }
  
  getAll(): Bluebird<IUserDetail[]>{
    return model.User.findAll({
      order: ['name']
    })
    .then(createUsers);
  }
  
  getById(id: number): Bluebird<IUserDetail>{
    return model.User.findOne({
      where: {id}
    })
    .then(create);
  }

  getUserForAuthorization(email: string, phone_number: string) {
    let query = {};

    if (email) {
      query['email'] = email;
    }

    if (phone_number) {
      query['phone_number'] = phone_number
    }
    
    return model.User.findOne({
      where: {
        [Op.and]: [query]
      }
    })
    .then(getUserForAuthorization);
  }

  update(id: number, user: any){
    return model.User.update(user, {
      where: {id},
      fields: ['name', 'email', 'phone_number', 'password', 'payment_mode'],
      hooks: true,
      individualHooks: true
    });
  }

  delete(id: number){
    return model.User.destroy({
      where: {id}
    });
  }
}

export default new User();
