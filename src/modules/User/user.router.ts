import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import { Request, Response } from 'express';
import UserController from './user.controller';
import * as HttpStatus from 'http-status';

export class UserRouterModule extends BaseRouterModule {
  private baseEndpoint: string = `${this.context}/${this.version}/${this.moduleName}/`;

  constructor() {
    super('user');
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    [this.moduleName]: {
      post: [
        {
          endpoint: this.baseEndpoint + 'new',
          callback: UserController.create,
          isProtected: false
        }
      ],
      get: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.readOnly,
          isProtected: false
        },
        {
          endpoint: this.baseEndpoint + 'all',
          callback: UserController.readAll,
          isProtected: false
        }
      ],
      patch: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.update,
          isProtected: false
        }
      ],
      delete: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.delete,
          isProtected: false
        }
      ]
    }
  }

  controller(req: Request, res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }
}