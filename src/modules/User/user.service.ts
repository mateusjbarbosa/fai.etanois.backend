import { IUserDetail, createUsers, create, getUserForAuthorization, EUserRoles } from './user.module';
import * as Bluebird from 'bluebird';
import * as bcrypt from 'bcrypt';
const model = require('../../entities');
const { Op } = require("sequelize");

class User {

  constructor() {}

  create(user: any): Promise<any>{
    if (user.phone_number || user.email) {
      user['etacoins'] = 0;
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

  update(id: number, user: any, role: EUserRoles){
    const keys = Object.keys(user);
    let fields: string[] = [];

    keys.forEach(property => {
      switch (property)
      {
        case 'id':
          fields.push(property);
        break;

        case 'phone_number':
          fields.push(property);
        break;

        case 'email':
          fields.push(property);
        break;

        case 'password':
          const salt = bcrypt.genSaltSync(10);
          
          user.password = bcrypt.hashSync(user.password, salt)
          fields.push(property);
        break;

        case 'name':
            fields.push(property);
        break;

        case 'search_distance':
          fields.push(property);
        break;

        case 'payment_mode':
          fields.push(property);
        break;

        case 'etacoins':
          if (role == EUserRoles.ADMIN) {
            fields.push(property);
          }
        break;
      }
    });

    return model.User.update(user, {
      where: {id},
      fields: fields,
      hooks: true,
      individualHooks: true
    })
    .then(create);
  }

  delete(id: number){
    return model.User.destroy({
      where: {id}
    });
  }
}

export default new User();
