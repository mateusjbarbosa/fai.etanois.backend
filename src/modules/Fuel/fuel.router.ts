import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import FuelController from './fuel.controller';

export class FuelRouterModule extends BaseRouterModule {
  constructor() {
    super('fuel');
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    [this.moduleName]: {
      get: [
        {
          endpoint: this.baseEndpoint,
          callback: FuelController.readAll,
          isProtected: false
        }
      ]
    }
  }
}