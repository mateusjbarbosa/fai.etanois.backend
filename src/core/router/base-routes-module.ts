import { Response, Request } from "express";
import * as HttpStatus from 'http-status';

export interface FeatureModuleRouterInfo {
  endpoint: string,
  callback: Function,
  isProtected: boolean
}

export interface HttpVerbMap {
  get?: Array<FeatureModuleRouterInfo>
  post?: Array<FeatureModuleRouterInfo>
  put?: Array<FeatureModuleRouterInfo>
  patch?: Array<FeatureModuleRouterInfo>
  delete?: Array<FeatureModuleRouterInfo>
}

export interface ModuleEndpointMap {
  [key: string]: HttpVerbMap
}

export class BaseRouterModule {
  protected readonly context: string = '/api';
  protected version: string = 'v1';
  protected moduleName: string;
  protected baseEndpoint: string;

  constructor(moduleName: string) {
    if (typeof moduleName == 'string') {
      this.moduleName = moduleName;
      this.baseEndpoint = `${this.context}/${this.version}/${this.moduleName}/`;
    }
  }

  protected MODULE_ENDPOINT_MAP: ModuleEndpointMap = {
    // Example for correct use 
    [this.moduleName]: {
      get: [ 
        {
          endpoint: `${this.context}/${this.version}/${this.moduleName}`,
          callback: (req: Request, res: Response) => {
            res.sendStatus(HttpStatus.OK).send({status: HttpStatus.OK, msg: 'ok'})
          },
          isProtected: false
        }
      ]
    }
  }

  public getRoutesFromModules(): ModuleEndpointMap{
    return this.MODULE_ENDPOINT_MAP;
  }
}