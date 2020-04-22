import { Request, Response} from 'express';
import * as _ from 'lodash';
import User from './user.service';
import Handlers from '../../core/handlers/response-handlers';
import { EUserRoles } from './user.module';
import Authenticate from '../Auth/authenticate.service'

class UserController {
  constructor() {}

  public create = (req: Request, res: Response) => {
    try {
      User.create(req.body)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.dbErrorHandler, res))
    } catch(error) {
      Handlers.onError(res, error);
    }
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
    const allowedRoles = [EUserRoles.ADMIN];
    const userId = parseInt(req.params.id);
    
    if (Authenticate.authorized(req, res, req.user, allowedRoles))
    {
      User.delete(userId)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.onError, res, 'Error deleting user'));
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
      Handlers.authSuccess(res, data.password, data);
    })
    .catch(_.partial(Handlers.onError, res, 'Invalid token'));
  }
}

export default new UserController();