import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { Application } from 'express';

class Api {
  private express: Application;

  constructor() {
    this.express = express();
  }

  middlewares(): void {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
  }

  getApplication(): Application {
    return this.express;
  }
}

export default new Api().getApplication();