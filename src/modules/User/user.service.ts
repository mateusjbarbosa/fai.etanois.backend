import { IUserDetail, createUsers, create, getUserForAuthorization, EUserRoles, 
  generateRandomToken} from './user.module';
import Redis from '../../core/redis/redis';
import * as Bluebird from 'bluebird';
import * as bcrypt from 'bcrypt';
const model = require('../../entities');
const { Op } = require("sequelize");

class User {

  constructor() {}

  create(user: any): Promise<any>{
    if (user.username && user.email) {
      user['etacoins'] = 0;

      return new Promise((resolve, reject) => {
        model.User.create(user)
        .then((userCreated) => {
          if (user.hasOwnProperty('user_preference_fuel')) {
            return user.user_preference_fuel.reduce((prev, object) => {
              object['user_id'] = userCreated.dataValues.id;
              model.UserPreferenceFuel.create(object);
            }, resolve({msg: 'Created user'}));
          } else {
            resolve({msg: 'Created user'})
          }
        })
        .catch(err => {reject(err)});
      });
    } else {
      throw new Error('Username and email are required').message;
    }
  }
  
  getAll(): Bluebird<IUserDetail[]>{
    return model.User.findAll({
      order: ['name'],
      include: [{
        model: model.UserPreferenceFuel}]
    })
    .then(createUsers);
  }
  
  getById(id: number): Bluebird<IUserDetail>{
    return model.User.findOne({
      where: {id},
      include: [{
        model: model.UserPreferenceFuel}]
    })
    .then(create);
  }

  getUserForAuthorization(email: string, username: string) {
    const query = this.generateQueryByCredential(email, username);
    
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

        case 'search_distance_with_route':
          fields.push(property);
        break;

        case 'search_distance_without_route':
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

  forgotPassword(email: string, username: string) {
    const query = this.generateQueryByCredential(email, username);

    return new Promise((resolve, reject) => {
      model.User.findOne({
        where: {
          [Op.and]: [query]
        }
      })
      .then(generateRandomToken)
      .then(msg => {resolve(msg)})
      .catch(err => {reject(err)});
    });
  }

  recoveryPassword(token: string) {
    const redis = new Redis();

    return redis.verifyExistenceToken(token).then(id => {
      if (id) {
        return model.User.findOne({
          where: {id}
        }).then(getUserForAuthorization);
      }
    });
  }

  private generateQueryByCredential(email: string, username: string): object {
    let query = {};

    if (email) {
      query['email'] = email;
    }

    if (username) {
      query['username'] = username
    }

    return query
  }
}

export default new User();
