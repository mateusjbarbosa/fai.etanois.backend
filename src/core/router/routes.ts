import { Application, Request, Response, NextFunction } from 'express';
import { RouterModuleFactory} from './router-map';
import { HttpVerbMap, FeatureModuleRouterInfo, ModuleEndpointMap } from './base-routes-module';

export class RouterModule {
  private routerFactory: RouterModuleFactory;
  private express: Application;

  constructor (app: Application) {
    this.express = app;
    this.routerFactory = new RouterModuleFactory();
  }

  public exposeRoutes(authenticate?: Function): void {
    const registratedModules: ModuleEndpointMap[] =  this.routerFactory.getRegisteredModules();
    console.log('Routes:');

    if(registratedModules && Array.isArray(registratedModules)) {
      registratedModules.forEach((module)  => {
        const moduleName: string = Object.keys(module)[0];
        this.extractRouterInfoFromModule(authenticate, module[moduleName]);
      });

      console.log('');
    }
  }

  private extractRouterInfoFromModule(authenticate: Function, routerFeatModule: HttpVerbMap) {
    if(routerFeatModule){
      const registedVerbs = Object.keys(routerFeatModule);
      registedVerbs.forEach(this.extractByVerb.bind(this, authenticate, routerFeatModule));
    }
  }

  private extractByVerb(authenticate: Function, routerFeatModule: HttpVerbMap,
    resgistredVeb: string) {
      routerFeatModule[resgistredVeb].forEach(this.mountRoutes.bind(this, authenticate,
        resgistredVeb));
  }

  private mountRoutes(authenticate: Function, resgistredVeb: string,
    routerInfo: FeatureModuleRouterInfo) {
      if(routerInfo) {
        const {isProtected, callback, endpoint} = routerInfo;
        isProtected 
          ? this.express.route(endpoint).all(authenticate())[resgistredVeb]
            (this.printRequestRoute ,callback)
          : this.express.route(endpoint)[resgistredVeb](this.printRequestRoute, callback);

        console.log(`${resgistredVeb}: ${endpoint} | isProtected: ${isProtected}`);
      }
  }

  private printRequestRoute(req: Request, res: Response, next: NextFunction): void {
    console.log(`\nURL:${req.url}`)

    if (req.user) {
      console.log(`User: ${req.user[`username`]}`)
    }

    next();
  }
}