import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import FuelStationController from './fuel-station.controller';

export class FuelStationRouterModule extends BaseRouterModule {
  constructor() {
    super('fuel_station');
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    [this.moduleName]: {
      post: [
        {
          endpoint: this.baseEndpoint + 'new',
          callback: FuelStationController.create,
          isProtected: true
        }
      ]
    }
  }
}