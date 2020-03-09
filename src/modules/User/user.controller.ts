import { Request, Response} from 'express';
import * as _ from 'lodash';
import User from './user.service';
import Handlers from '../../core/handlers/response-handlers';
import { EUserRoles } from './user.module';

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
    
    if (this.authorized(req, res, req.user, allowedRoles))
    { 
      if (this.verifyUserType(req, res, req.user['role'], userId, req.user['id']))
      {
        User.getById(userId)
        .then(_.partial(Handlers.onSuccess, res))
        .catch(_.partial(Handlers.onError, res, 'User not found'));
      }
    }
  }

  public readAll = (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN];
    
    if (this.authorized(req, res, req.user, allowedRoles))
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
    
    if (this.authorized(req, res, req.user, allowedRoles))
    {
      if (this.verifyUserType(req, res, req.user['role'], userId, req.user['id']))
      {
        User.update(userId, props)
        .then(_.partial(Handlers.onSuccess, res))
        .catch(_.partial(Handlers.dbErrorHandler, res))
        .catch(_.partial(Handlers.onError, res, 'Error updating user'));
      }
    }
  }

  public delete = (req: Request, res: Response) => {
    const allowedRoles = [EUserRoles.ADMIN];
    const userId = parseInt(req.params.id);
    
    if (this.authorized(req, res, req.user, allowedRoles))
    {
      User.delete(userId)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.onError, res, 'Error deleting user'));
    }
  }

  private authorized = (req: Request, res: Response, user: any, allowedRoles: EUserRoles[]) => {
    let authorized: boolean = false

    if (!!user['role'] && (allowedRoles.indexOf(user['role']) != -1))
    {
      authorized = true;
    }
    else
    {
      return Handlers.authFail(req, res);
    }

    return authorized;
  }

  private verifyUserType = (req: Request, res: Response, role: any, idRequest, idUserLogged) => {
    let authorized: boolean = false

    if ((role == EUserRoles.ADMIN) || (role == EUserRoles.DRIVER && idRequest == idUserLogged))
    {
      authorized = true;
    } else {
      return Handlers.authFail(req, res);
    }

    return authorized;
  }
}

export default new UserController();