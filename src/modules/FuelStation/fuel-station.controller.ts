import Handlers from '../../core/handlers/response-handlers';
import FuelStation from './fuel-station.service';
import { Request, Response } from 'express';
import { to, isCNPJ, isCEP, onlyNumbers, trimAll, validateHhMm } from '../../core/util/util';
import { IFuelStationDetail } from './fuel-station.module';
import { error } from 'console';

class FuelStationController {
  constructor() { }

  public create = async (req: Request, res: Response) => {
    let body = req.body;
    const user_id = req.user['id'];
    const success_message = 'Your fuel station has been created and is in approval phase.' +
      'We will send an email with the situation soon'

    let error = this.validateBody(body);
    body = trimAll(body);

    if (error) {
      Handlers.onError(res, error);
      return;
    }

    body.cep = onlyNumbers(body.cep);
    body.cnpj = onlyNumbers(body.cnpj);
    body['user_id'] = user_id;

    const [err_create_fuel_station, fuel_station] = await to<IFuelStationDetail>(
      FuelStation.create(body));

    if (err_create_fuel_station) {
      Handlers.dbErrorHandler(res, err_create_fuel_station);
      return;
    }

    Handlers.onSuccess(res, { fuel_station: success_message });
  };

  private validateBody(body: any): string {
    let error: string;

    if (!isCNPJ(body.cnpj)) {
      error = 'Invalid CNPJ'
    } else if (!isCEP(body.cep)) {
      error = 'Invalid CEP'
    } else if (!validateHhMm(body.time_to_open)) {
      error = 'Invalid opening hours'
    } else if (!validateHhMm(body.time_to_close)) {
      error = 'Invalid close time'
    }

    return error;
  }
}

export default new FuelStationController();