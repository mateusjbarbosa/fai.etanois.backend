import { IUserDetail, createUsers, create, getUserForAuthorization, EUserRoles, 
  generateRandomToken, IUserForAuthorization} from './user.module';
import Redis from '../../core/redis/redis';
import * as Bluebird from 'bluebird';
import * as bcrypt from 'bcrypt';
import { to } from '../../core/util/util';
const model = require('../../entities');
const { Op } = require("sequelize");

class User {

  constructor() {}

  public create(user: IUserDetail): Promise<IUserDetail> {
    return model.User.create(user)
    .then(create);
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
    return new Promise(async(resolve, reject) => {
      const transaction = await model.sequelize.transaction();
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
  
      try {
        const userUpdated = await model.User.update(user, {
          where: {
            [Op.and]: [query]
          },
          fields: fields,
          hooks: true,
          individualHooks: true
        }, { transaction: transaction });

        await transaction.commit();
        resolve(userUpdated)
      } catch(err) {
        await transaction.rollback();
        reject(err);
      }
    })
  }

  public delete(id: number){
    const user = {
      id: id,
      activate: false
    }

    return model.User.update(user, {
      where: {id},
      fields: ['activate'],
      hooks: true,
      individualHooks: true
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

    query['activate'] = false;

    const [err, success] = await to<any>(model.User.update(user, {
        where: {
          [Op.and]: [query]
        },
        fields: ['activate'],
        hooks: true,
        individualHooks: true
      }));
    
      if (err) {
        throw new Error()  
      }
      
      return create(success);
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
