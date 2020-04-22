import { IUserDetail, createUsers, create, getUserForAuthorization, EUserRoles, 
  generateRandomToken} from './user.module';
import Authenticate from '../Auth/authenticate.service';
import Redis from '../../core/redis/redis';
import Nodemailer from '../../core/nodemailer/nodemailer';
import * as Bluebird from 'bluebird';
import * as bcrypt from 'bcrypt';
const model = require('../../entities');
const { Op } = require("sequelize");

class User {

  constructor() {}

  public create(user: any): Promise<any> {
    const successfulRegistration = {msg: 'Created user'};
    user['etacoins'] = 0;

    return new Promise(async(resolve, reject) => {
      const transaction = await model.sequelize.transaction();

      try {
        const userCreated = await model.User.create(user, { transaction: transaction});

        if (user.hasOwnProperty('user_preference_fuel')) {
          user.user_preference_fuel.forEach(object => {
            object['user_id'] = userCreated.dataValues.id;
          });

          try {
            await model.UserPreferenceFuel.bulkCreate(user.user_preference_fuel,
              {transaction: transaction})
          } catch(err) {
            await transaction.rollback();
            reject({ errors: [{message: 'Fuel is not registered'}] });
            return;
          }
        }

        Nodemailer.sendEmailActivateAccount(user.email, Authenticate.getToken(user))
        .then(async(msg) => {
          await transaction.commit();
          resolve(successfulRegistration)  
        })
        .catch(async(err) => {
          await transaction.rollback();
          reject({ errors: [{message: 'Internal server error: ERR-01'}] });
        });
      } catch(err) {
        await transaction.rollback();
        reject(err);
      }
    });
  }
  
  public getAll(): Bluebird<IUserDetail[]>{
    return model.User.findAll({
      order: ['name'],
      include: [{
        model: model.UserPreferenceFuel}]
    })
    .then(createUsers);
  }
  
  public getById(id: number): Bluebird<IUserDetail>{
    return model.User.findOne({
      where: {id},
      include: [{
        model: model.UserPreferenceFuel}]
    })
    .then(create);
  }

  public getUserForAuthorization(email: string, username: string) {
    const query = this.generateQueryByCredential(email, username);
    
    return model.User.findOne({
      where: {
        [Op.and]: [query]
      }
    })
    .then(getUserForAuthorization);
  }

  public update(id: number, user: any, role: EUserRoles){
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

  public delete(id: number){
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
