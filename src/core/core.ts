import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import { RouterModule } from './router/routes';
import AuthService from '../modules/Auth/auth.service';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import Handlers from './handlers/response-handlers';

const cors = require('cors');

export class CoreModule {
  private express: Application;
  private routerModule;

  constructor() {
    this.express = express();
    this.configExpress();
    this.routerModule = new RouterModule(this.express);
    this.router();
  }

  private configExpress(): void {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
    this.express.use(Handlers.errorHandlerApi);
    this.express.use(AuthService.initialize());
    this.express.use(cors());
  }

  public getApplication(): Application {
    return this.express;
  }

  private router(): void {
    this.routerModule.exposeRoutes(AuthService.authenticate);
  }
}