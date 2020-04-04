import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import FuelController from './fuel.controller';

export class FuelRouterModule extends BaseRouterModule {
  constructor() {
    super('fuel');
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    [this.moduleName]: {
      post: [
        {
          endpoint: this.baseEndpoint + 'new',
          callback: FuelController.create,
          isProtected: true
        }
      ],
      get: [
        {
          endpoint: this.baseEndpoint,
          callback: FuelController.readAll,
          isProtected: true
        }
      ],
      patch: [
        {
          endpoint: this.baseEndpoint + ':name',
          callback: FuelController.update,
          isProtected: true, 
        }
      ],
      delete: [
        {
          endpoint: this.baseEndpoint + ':name',
          callback: FuelController.delete,
          isProtected: true
        }
      ]
    }
  }
}