import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import FuelStationController from './fuel-station.controller';
import FuelStationAvailableFuelController from './available-fuel.controller';

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
        },
        {
          endpoint: this.baseEndpoint + ':id/available-fuel',
          callback: FuelStationAvailableFuelController.createOrUpdateAvailableFuel,
          isProtected: true
        }
      ],
      get: [
        {
          endpoint: this.baseEndpoint + ':id',
          callback: FuelStationController.readOnly,
          isProtected: true
        },
        {
          endpoint: this.baseEndpoint + 'read-all/:page',
          callback: FuelStationController.readAllByUser,
          isProtected: true
        }
      ]
    }
  }
}