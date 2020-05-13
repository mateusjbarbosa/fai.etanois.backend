import { Request, Response} from 'express';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import User from './user.service';
import FuelPreference from './fuel-preference.service';
import Handlers from '../../core/handlers/response-handlers';
import Nodemailer from '../../core/nodemailer/nodemailer';
import { EUserRoles, IUserDetail, IUserForAuthorization } from './user.module';
import { to, findWithAttr, generateRadomToken } from '../../core/util/util';
import { IFuel, IFuelDetail } from '../Fuel/fuel.module';
import { IUserPreferenceFuel } from './fuel-preference.module';
import Redis from '../../core/redis/redis';
import Authenticate from '../Auth/authenticate.service'
import Fuel from '../Fuel/fuel.service';


class UserController {
  constructor() {}

  public create = async(req: Request, res: Response) => {
    const body = req.body
    let errors: string[] = [];

    body['etacoins'] = 0;

    const [errCreateUser, user] = await to<IUserDetail>(User.create(body))
    
    if (errCreateUser) {
      Handlers.dbErrorHandler(res, errCreateUser);
      return;
    }

    if (body.hasOwnProperty('user_preference_fuel')) {
      const[errFuel, fuels] = await to<IFuelDetail[]>(this.createFuelPreference(
        body.user_preference_fuel, user.id, errors));

      if (!errFuel) {
        user.user_preference_fuels = fuels;
      }
    }

    const [errEmail, successEmail] =
      await to<any>(Nodemailer.sendEmailActivateAccount(user.email, Authenticate.getToken(user)));

    if (errEmail) {
      errors.push('It was not possible to send the email');
    }

    Handlers.onSuccess(res, {user: user, msg: errors});
  }

  private async createFuelPreference(fuelPreference: IFuelDetail[], userId: number, errors: any[]):
    Promise<IFuelDetail[]> {
    const [err, fuels] = await to<IFuel[]>(Fuel.getAll());
    let userPreference: IFuelDetail[] = [];

    if (err) {
      errors.push('It was not possible to create the fuels');
      return;
    }

    const promises = fuelPreference.map(async (object) => {
      const index = findWithAttr(fuels, 'name', object.name);

      if (index >= 0) {
        const fuelDetail: IUserPreferenceFuel = {fuel_id: fuels[index].id, user_id: userId};
        
        const [errFuel, fuelCreated] = 
          await to<IUserPreferenceFuel>(FuelPreference.create(fuelDetail));

        if (errFuel) {
          errors.push(`Unable to associate user with ${object.name}`);
        } else {
          const fuelPreferenceDetail: IFuelDetail = {name: object.name};
          
          userPreference.push(fuelPreferenceDetail);
        }
      } else {
        errors.push(`Unable to associate user with ${object.name}`);
      }
    });

    await Promise.all(promises);

    return (userPreference);
  }

  public readOnly = async(req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN, EUserRoles.DRIVER];
    const userId = parseInt(req.params.id);
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    { 
      if (Authenticate.verifyUserType(req, res, req.user['role'], userId, req.user['id']))
      {
        const [err, success] = await to<IUserDetail>(User.getById(userId));
        
        if (err) {
          Handlers.onError(res, 'User not found');
          return;
        }

        Handlers.onSuccess(res, success);
      }
    }
  }

  public readAll = (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN];
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    {
      User.getAll()
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.onError, res, 'Error fetching all users'));
    }
  }

  public update = async (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN, EUserRoles.DRIVER];
    const user_id = parseInt(req.params.id);
    const user = req.body;
    const role = req.user['role'];
    const errors: string[] = [];
    let update_fuel_preference: boolean = false;
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    {
      if (Authenticate.verifyUserType(req, res, role, user_id, req.user['id']))
      {
        const keys = Object.keys(user);
        let fields: string[] = [];

        keys.forEach(async property => {
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

            case 'user_preference_fuels':
              update_fuel_preference = true;
            break;
          }
        });

        const [err, success] = await to<IUserDetail>(User.update(user_id, user, fields));

        if (err) {
          Handlers.dbErrorHandler(res, err);
          return;
        }

        if (update_fuel_preference) {
          const [err_delete_fuel_pref, success_delete_fuel_pref] = 
          await to<any>(FuelPreference.deleteByUser(user_id));

          const [err_create_preference_fuel, success_create_preference_fuel] = 
            await to<IFuelDetail[]>(this.createFuelPreference(
              user['user_preference_fuels'], user_id, errors));

          success['user_preference_fuels'] = success_create_preference_fuel;
        } else {
          const [err_fuel_preference, success_fuel_preference] = 
          await to<IFuelDetail[]>(FuelPreference.readByUser(user_id));

          if (!err_fuel_preference) {
            success['user_preference_fuels'] = success_fuel_preference;
          } 
        }

        Handlers.onSuccess(res, {user: success, msg: errors});
      }
    }
  }

  public delete = async (req: Request, res: Response) => {
    new Promise(async (resolve) => {
      const allowedRoles = [EUserRoles.ADMIN, EUserRoles.DRIVER];
      const user_id = parseInt(req.params.id);

      if (Authenticate.authorized(req, res, req.user, allowedRoles))
      {
        if (Authenticate.verifyUserType(req, res, req.user['role'], user_id, req.user['id']))
        {
          const [err, user] = await to<IUserDetail>(User.delete(user_id));
          
          if (err) {
            resolve(Handlers.dbErrorHandler(res, err));
          }

          resolve(Handlers.onSuccess(res, user));
        }
      }
    });
  }

  public forgotPassword = async (req: Request, res: Response) => {
    const {username, email} = req.body;

    if (username || email) {
      const [err, user] = await to<IUserDetail>(User.readByEmailOrUsername(email, username));
      
      if (err) {
        Handlers.dbErrorHandler(res, err)
        return;
      }

      const redis = new Redis();
      const [err_token, token] = await to<string>(generateRadomToken());
  
      if (err_token) {
        Handlers.onError(res, 'It was not possible to generate the token');
        return;
      }

      redis.createRecoverPassword(token, user.id.toString());
  
      const [err_email, success_email] = 
      await to<any>(Nodemailer.sendEmailRecoverPassword(user.email, token));
    
      if (err_email) {
        Handlers.onError(res, 'It was not possible to send the email');
        return;
      }

      Handlers.onSuccess(res, 'E-mail sent');
    } else {
      Handlers.onError(res, 'E-mail/Phone number and password are required');
    }
  }

  public recovryPassword = async (req: Request, res: Response) => {
    const token = req.params.token;
    const redis = new Redis();

    const [err_redis, id_user] = await to<string>(redis.verifyExistenceToken(token));

    if (err_redis || !id_user) {
      Handlers.onError(res, 'Invalid token');
      return;
    }

    const [err_db, user] = 
      await to<IUserForAuthorization>(User.getUserForAuthorization(null, null, Number(id_user)))
    
    if (err_db) {
      Handlers.onError(res, 'Invalid token');
      return;
    }

    Handlers.sendToken(res, user);
  }

  public activateAccout = async (req: Request, res: Response) => {
    const [errToken, user] =
      await to<IUserForAuthorization>(Authenticate.getJwtPayload(req.params.token));

    if (errToken) {
      Handlers.onError(res, 'Invalid token');
      return;
    }

    const [errActivate, success] = await to<IUserDetail>(User.activateAccount(user));

    if (errActivate) {
      Handlers.onError(res, 'User is already active');
      return;
    }

    Handlers.onSuccess(res, {user: success});
  }
}

export default new UserController();