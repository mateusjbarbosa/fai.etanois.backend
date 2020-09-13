import { BaseRouterModule, ModuleEndpointMap } from '../../core/router/base-routes-module'
import FuelStationController from './fuel-station.controller';
import FuelStationAvailableFuelController from './available-fuel.controller';
import FuelStationAvailableServiceController from './available-service.controller';

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
        },
        {
          endpoint: this.baseEndpoint + ':id/available-service',
          callback: FuelStationAvailableServiceController.createOrUpdateAvailableService,
          isProtected: true
        }
      ],
      get: [
        {
          endpoint: this.baseEndpoint + ':id/read-only',
          callback: FuelStationController.readOnly,
          isProtected: true
        },
        {
          endpoint: this.baseEndpoint + 'read-by-user/:page',
          callback: FuelStationController.readAllByUser,
          isProtected: true
        },
        {
          endpoint: this.baseEndpoint + 'read-all-flags',
          callback: FuelStationController.readAllFlag,
          isProtected: true
        },
        {
          endpoint: this.baseEndpoint + 'read-all-available-services',
          callback: FuelStationAvailableServiceController.readAllAvailableServices,
          isProtected: true
        }
      ]
    }
  }
}