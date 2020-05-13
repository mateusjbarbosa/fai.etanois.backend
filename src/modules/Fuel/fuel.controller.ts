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

  public update = (req: Request, res: Response) => {
    const oldFuelName: string = req.params.name;
    const newFuelName: string = req.body;

    if (Authenticate.verifyUserType(req, res, req.user['role'], 0, req.user['id'])) {
      Fuel.update(oldFuelName, newFuelName)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.dbErrorHandler, res))
      .catch(_.partial(Handlers.onError, res, 'Error updating fuel'));
    }
  }

  public delete = (req: Request, res: Response) => {
    const fuelName: string = req.params.name;

    if (Authenticate.verifyUserType(req, res, req.user['role'], 0, req.user['id'])) {
      Fuel.delete(fuelName)
      .then(_.partial(Handlers.onSuccess, res))
      .catch(_.partial(Handlers.onError, res, 'Error deleting fuel'));
    }
  }
}

export default new FuelController();