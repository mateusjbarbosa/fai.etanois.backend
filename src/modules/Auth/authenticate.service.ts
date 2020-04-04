import { Request, Response} from 'express';
import Handlers from '../../core/handlers/response-handlers';
import { EUserRoles } from '../User/user.module';

class Authenticate {
  constructor() {}

  public authorized = (req: Request, res: Response, user: any, allowedRoles: EUserRoles[]) => {
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

  public verifyUserType = (req: Request, res: Response, role: any, idRequest, idUserLogged) => {
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

export default new Authenticate();