import Handlers from '../../core/handlers/response-handlers';
import { Request, Response} from 'express';
import { readAllFuels } from './fuel.module';


class FuelController {
  constructor() {}

  public readAll = async (req: Request, res: Response) => { 

    Handlers.onSuccess(res, readAllFuels());
  }
}

export default new FuelController();