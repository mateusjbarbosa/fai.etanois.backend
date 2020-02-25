import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

class Api {
  private express: Application;

  constructor() {
    this.express = express();
    this.configExpress();
  }

  configExpress(): void {
    this.express.use(this.configHeaders.bind(this));
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
  }

  getApplication(): Application {
    return this.express;
  }

  private configHeaders(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  }
}

export default new Api().getApplication();