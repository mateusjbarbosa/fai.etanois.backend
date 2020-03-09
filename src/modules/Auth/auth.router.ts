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
    const {phone_number, email, password} = req.body;

    if ((email || phone_number) && password) {
      try {
        const user = await User.getUserForAuthorization(email, phone_number);
        ResponseHandlers.authSuccess(res, password, user);
      } catch(error) {
        ResponseHandlers.authFail(req, res);
      }
    } else {
      ResponseHandlers.onError(res, 'E-mail/Phone number and password are required');
    }
  }
}