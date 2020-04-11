import { Request, Response} from 'express';
import * as _ from 'lodash';
import Authenticate from '../Auth/authenticate.service'
import Fuel from './fuel.service';
import Handlers from '../../core/handlers/response-handlers';

class FuelController {
  constructor() {}

  public create = (req: Request, res: Response) => {
    if (Authenticate.verifyUserType(req, res, req.user['role'], 0, req.user['id'])) {
      try {
        Fuel.create(req.body)
        .then(_.partial(Handlers.onSuccess, res))
        .catch(_.partial(Handlers.dbErrorHandler, res))
      } catch(error) {
        Handlers.onError(res, error);
      }
    }
  }

  public readAll = (req: Request, res: Response) => {
    Fuel.getAll()
    .then(_.partial(Handlers.onSuccess, res))
    .catch(_.partial(Handlers.onError, res, 'Error fetching all fuels'));
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