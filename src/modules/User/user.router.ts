import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import UserController from './user.controller';

export class UserRouterModule extends BaseRouterModule {
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
        },
        {
          endpoint: this.baseEndpoint + 'forgot_password',
          callback: UserController.forgotPassword,
          isProtected: false
        }
      ],
      get: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.readOnly,
          isProtected: true
        },
        {
          endpoint: this.baseEndpoint,
          callback: UserController.readAll,
          isProtected: true
        }
      ],
      patch: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.update,
          isProtected: true
        }
      ],
      delete: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.delete,
          isProtected: true
        }
      ]
    }
  }
}