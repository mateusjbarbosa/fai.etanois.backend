import { Request, Response} from 'express';
import * as _ from 'lodash';
import User from './user.service';
import FuelPreference from './fuel-preference.service';
import Handlers from '../../core/handlers/response-handlers';
import Nodemailer from '../../core/nodemailer/nodemailer';
import { EUserRoles, IUserDetail } from './user.module';
import { to, findWithAttr } from '../../core/util/util';
import Authenticate from '../Auth/authenticate.service'
import { IFuel, IFuelDetail } from '../Fuel/fuel.module';
import Fuel from '../Fuel/fuel.service';
import { IUserPreferenceFuel } from './fuel-preference.module';

class UserController {
  constructor() {}

  public create = async(req: Request, res: Response) => {
    const body = req.body
    let errors: string[] = [];
    const [errCreateUser, user] = await to<IUserDetail>(User.create(body))

    body['etacoins'] = 0;

    if (errCreateUser) {
      Handlers.onError(res, errCreateUser.message);
      return;
    }

    if (body.hasOwnProperty('user_preference_fuel')) {
      const[errFuel, fuels] = await to<IFuelDetail[]>(this.createFuelPreference(
        body.user_preference_fuel, user.id, errors));

      if (!errFuel) {
        user.UserPreferenceFuels = fuels;
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

  public readOnly = (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN, EUserRoles.DRIVER];
    const userId = parseInt(req.params.id);
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    { 
      if (Authenticate.verifyUserType(req, res, req.user['role'], userId, req.user['id']))
      {
        User.getById(userId)
        .then(_.partial(Handlers.onSuccess, res))
        .catch(_.partial(Handlers.onError, res, 'User not found'));
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

  public update = (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN, EUserRoles.DRIVER];
    const userId = parseInt(req.params.id);
    const props = req.body;
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    {
      if (Authenticate.verifyUserType(req, res, req.user['role'], userId, req.user['id']))
      {
        User.update(userId, props, req.user['role'])
        .then(_.partial(Handlers.onSuccess, res))
        .catch(_.partial(Handlers.dbErrorHandler, res))
        .catch(_.partial(Handlers.onError, res, 'Error updating user'));
      }
    }
  }

  public delete = (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN, EUserRoles.DRIVER];
    const userId = parseInt(req.params.id);
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    {
      if (Authenticate.verifyUserType(req, res, req.user['role'], userId, req.user['id']))
      {
        User.delete(userId)
        .then(_.partial(Handlers.onSuccess, res))
        .catch(_.partial(Handlers.onError, res, 'Error deleting user'));
      }
    }
  }

  public forgotPassword = (req: Request, res: Response) => {
    const {username, email} = req.body;

    if (username || email) {
      User.forgotPassword(email, username)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(err => { Handlers.onError(res, err) });
    } else {
      Handlers.onError(res, 'E-mail/Phone number and password are required');
    }
  }

  public recovryPassword = (req: Request, res: Response) => {
    const token = req.params.token;

    User.recoveryPassword(token)
    .then(data => {
      Handlers.sendToken(res, data);
    })
    .catch(_.partial(Handlers.onError, res, 'Invalid token'));
  }

  public activateAccout = (req: Request, res: Response) => {
    const token = req.params.token;

    try {
      User.activateAccount(token)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.onError, res, 'User is already active'));
    } catch(err) {
      Handlers.onError(res, 'Invalid token');
    }
  }
}

export default new UserController();