import Handlers from '../../core/handlers/response-handlers';
import { Request, Response} from 'express';

class FuelStationController {
  constructor() {}

  public create = async (req: Request, res: Response) => {
    Handlers.onSuccess(res, 'ok');
  };
}

export default new FuelStationController();