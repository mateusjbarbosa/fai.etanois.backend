import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import { Request, Response } from 'express';
import * as HttpStatus from 'http-status';

export class UserRouterModule extends BaseRouterModule {
  constructor() {
    super('user');
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    [this.moduleName]: {
      get: [
        {
          endpoint: `${this.context}/${this.version}/${this.moduleName}/new`,
          callback: this.controller,
          isProtected: false
        }
      ]
    }
  }

  controller(req: Request, res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }
}