import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import { Request, Response } from 'express';
import User from '../User/user.service';
import ResponseHandlers from '../../core/handlers/response-handlers';

export class AuthRouterModule extends BaseRouterModule {
  constructor() {
    super('auth');
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    [this.moduleName]: {
      post: [
        {
          endpoint: this.baseEndpoint + 'token',
          callback: this.auth,
          isProtected: false
        }
      ]
    }
  }

  async auth(req: Request, res: Response) {
    const {username, email, password} = req.body;

    if ((email || username) && password) {
      try {
        const user = await User.getUserForAuthorization(email, username, null);
        ResponseHandlers.authSuccess(res, password, user);
      } catch(error) {
        ResponseHandlers.authFail(req, res);
      }
    } else {
      ResponseHandlers.onError(res, 'E-mail/Username and password are required');
    }
  }
}