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
    let query = {};

    query['id'] = id;
    query['activate'] = true;

    return model.User.findOne({
      where: {
        [Op.and]: [query]
      },
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
    let query = {};
    let fields: string[] = [];

    keys.forEach(property => {
      switch (property)
      {
        case 'email':
        case 'id':
        case 'name':
        case 'search_distance_with_route':
        case 'search_distance_without_route':
        case 'payment_mode':
          fields.push(property);
        break;

        case 'password':
          const salt = bcrypt.genSaltSync(10);
          
          user.password = bcrypt.hashSync(user.password, salt)
          fields.push(property);
        break;

        case 'etacoins':
          if (role == EUserRoles.ADMIN) {
            fields.push(property);
          }
        break;
      }
    });

    query['id'] = id;
    query['activate'] = true;

    return model.User.update(user, {
      where: {
        [Op.and]: [query]
      },
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

  public forgotPassword(email: string, username: string) {
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

  public recoveryPassword(token: string) {
    const redis = new Redis();
    let query = {};

    return redis.verifyExistenceToken(token).then(id => {
      if (id) {
        query['id'] = id;
        query['activate'] = true;

        return model.User.findOne({
          where: {
            [Op.and]: [query]
          }
        })
        .then(getUserForAuthorization);
      }
    });
  }

  public activateAccount(token: string) {
    try {
      const user = Authenticate.getJwtPayload(token)
      .catch(err => {})
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
  
      query['activate'] = false;
  
      return model.User.update(user, {
        where: {
          [Op.and]: [query]
        },
        fields: ['activate'],
        hooks: true,
        individualHooks: true
      })
      .then(create);
    } catch {
      throw new Error()
    }
  }

  private generateQueryByCredential(email: string, username: string): object {
    let query = {};

    if (email) {
      query['email'] = email;
    }

    if (username) {
      query['username'] = username
    }

    query['activate'] = true;

    return query
  }
}

export default new User();
