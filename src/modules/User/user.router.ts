import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import UserController from './user.controller';
import { EUserRoles } from './user.module';

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
        }
      ],
      get: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.readOnly,
          isProtected: false
        },
        {
          endpoint: this.baseEndpoint,
          callback: UserController.readAll,
          isProtected: true,
          allowedRoles: [EUserRoles.ADMIN]
        }
      ],
      patch: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.update,
          isProtected: false,
          
        }
      ],
      delete: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: UserController.delete,
          isProtected: true,
          allowedRoles: [EUserRoles.ADMIN]
        }
      ]
    }
  }
}