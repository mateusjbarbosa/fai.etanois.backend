import { IUser, IUserDetail, createUsers, create } from './user.module';
import * as Bluebird from 'bluebird';
const model = require('../../entities');

class User {

  constructor() {

  }

  create(user: any){
    return model.User.create(user)
    .then(create);
  }
  
  getAll(): Bluebird<IUser[]>{
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

  getByEmail(email: string): Bluebird<IUserDetail>{
    return model.User.findOne({
      where: {email}
    })
    .then(create);
  }

  update(id: number, user: any){
    return model.User.update(user, {
      where: {id},
      fields: ['name', 'email', 'phone_number', 'password'],
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
