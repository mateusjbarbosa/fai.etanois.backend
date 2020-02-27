import { IUser, IUserDetail, createUsers, create, getUserForAuthorization } from './user.module';
import * as Bluebird from 'bluebird';
const model = require('../../entities');

class User {

  constructor() {}

  create(user: any){
    return model.User.create(user);
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

  getUserForAuthorization(email: string) {
    return model.User.findOne({
      where: {email}
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
