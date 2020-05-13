import * as _ from 'lodash';
import Authenticate from '../Auth/authenticate.service'
import Fuel from './fuel.service';
import Handlers from '../../core/handlers/response-handlers';
import { Request, Response} from 'express';
import { IFuel } from './fuel.module';
import { to } from '../../core/util/util';


class FuelController {
  constructor() {}

  public create = async (req: Request, res: Response) => {
    if (Authenticate.verifyUserType(req, res, req.user['role'], 0, req.user['id'])) {
      const new_fuel = req.body;

      const [err, fuel] = await to<IFuel>(Fuel.create(new_fuel));

      if (err) {
        Handlers.dbErrorHandler(res, err);
        return;
      }

      Handlers.onSuccess(res, fuel);
    }
  }

  public readAll = async (req: Request, res: Response) => { 
    const [err_db, fuels] = await to<IFuel[]>(Fuel.getAll());
    
    if (err_db) {
      Handlers.dbErrorHandler(res, err_db);
      return;
    }

    Handlers.onSuccess(res, fuels);
  }

  public update = async (req: Request, res: Response) => {
    const old_fuel: IFuel = {name: req.params.name};
    const new_fuel: IFuel = {name: req.body.name};

    if (Authenticate.verifyUserType(req, res, req.user['role'], 0, req.user['id'])) {
      const [err_db, old_fuel_db] = await to<IFuel>(Fuel.findByName(old_fuel.name));

      if (!old_fuel_db) {
        if (err_db) {
          Handlers.dbErrorHandler(res, err_db);
        } else {
          Handlers.onError(res, 'Fuel not found');
        }
        return;
      }

      const [err, fuel] = await to<IFuel>(Fuel.update(old_fuel_db, new_fuel));

      if (err) {
        Handlers.dbErrorHandler(res, err);
        return;
      }

      this.readAll(req, res);
    }
  }

  public delete = async (req: Request, res: Response) => {
    const fuel_name: string = req.params.name;

    if (Authenticate.verifyUserType(req, res, req.user['role'], 0, req.user['id'])) {
      const [err, success] = await to<void>(Fuel.delete(fuel_name));

      if (err) {
        Handlers.dbErrorHandler(res, err);
        return;
      }
      
      this.readAll(req, res);
    }
  }
}

export default new FuelController();