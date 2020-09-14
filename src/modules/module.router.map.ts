import { UserRouterModule } from "./User/user.router";
import { AuthRouterModule } from "./Auth/auth.router";
import { FuelRouterModule } from "./Fuel/fuel.router";
import { FuelStationRouterModule } from "./FuelStation/fuel-station.router";

export interface FeatureModuleRouter {
  moduleName: any;
  parser: string;
}

export class ModulesRouterMapper {
  public registeredModules: Array<FeatureModuleRouter> = [
    {
      moduleName: UserRouterModule,
      parser: 'getRoutesFromModules'
    },
    {
      moduleName: AuthRouterModule,
      parser: 'getRoutesFromModules'
    },
    {
      moduleName: FuelRouterModule,
      parser: 'getRoutesFromModules'
    },
    {
      moduleName: FuelStationRouterModule,
      parser: 'getRoutesFromModules'
    }
  ];

}