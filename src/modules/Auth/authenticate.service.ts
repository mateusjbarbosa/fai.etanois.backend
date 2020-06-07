import { Request, Response} from 'express';
import { ExtractJwt } from 'passport-jwt';
import Handlers from '../../core/handlers/response-handlers';
import Configuration from '../../config/config';
import { EUserRoles } from '../User/user.module';
import * as jwt from 'jwt-simple';

class Authenticate {
  private opts = {
    secretOrKey: Configuration.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };

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

  public getToken(data: any) {
    const payload = {id: data.id, password: data.password, email: data.email,
      username: data.username};

    return jwt.encode(payload, Configuration.secret)
  }

  public getJwtPayload(token: string): Promise<any> {
    return new Promise((resolve) => {
      resolve (jwt.decode(token, Configuration.secret))
    });
  }
}

export default new Authenticate();