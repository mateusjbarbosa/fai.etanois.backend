import { ModuleEndpointMap } from "./base-routes-module";
import { ModulesRouterMapper,  FeatureModuleRouter} from '../../modules/module.router.map';

export class RouterModuleFactory {
  private routerModulesMap: Array<ModuleEndpointMap> = [];

  constructor() {
    this.bootstrapModules(new ModulesRouterMapper());
  }

  private bootstrapModules(routerModulesMapper: ModulesRouterMapper) {
    this.routerModulesMap = routerModulesMapper
      .registeredModules.map(this.createModules.bind(this));
  }

  private createModules(registeredModele: FeatureModuleRouter): Array<ModuleEndpointMap> {
    const { moduleName, parser} = registeredModele;

    return new moduleName()[parser]();
  }

  public getRegisteredModules() {
    return this.routerModulesMap.map((routerModule: ModuleEndpointMap) => {
      const moduleName: string = Object.keys(routerModule)[0];
      
      return moduleName;
    });
  }
}