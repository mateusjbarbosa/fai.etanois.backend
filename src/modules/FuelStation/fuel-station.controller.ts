import Handlers from '../../core/handlers/response-handlers';
import FuelStation from './fuel-station.service';
import { Request, Response } from 'express';
import { to, isCNPJ, isCEP, onlyNumbers, trimAll, validateHhMm } from '../../core/util/util';
import { IFuelStationDetail } from './fuel-station.module';

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

  public readOnly = async (req: Request, res: Response) => {
    return new Promise(async resolve => {
      const user_id = req.user['id'];
      const fuel_station_id = parseInt(req.params.id);

      const [err_read_fuel_station, fuel_station] = await to<IFuelStationDetail>(
        FuelStation.readById(fuel_station_id, user_id));

      if (err_read_fuel_station) {
        Handlers.dbErrorHandler(res, err_read_fuel_station);
        return resolve();
      }

      Handlers.onSuccess(res, fuel_station);
      return resolve();
    });
  }

  public readAllByUser = async (req: Request, res: Response) => {
    return new Promise(async resolve => {
      const user_id = req.user['id'];
      const page = parseInt(req.params.page);

      if (page < 1) {
        Handlers.onError(res, 'The page must be greater than or equal to 1')
      }

      const [err_read_fuel_stations, fuel_stations] = await to<any>(
        FuelStation.readByUser(user_id, page));

        if (err_read_fuel_stations) {
          Handlers.dbErrorHandler(res, err_read_fuel_stations);
          return resolve();
        }

        Handlers.onSuccess(res, fuel_stations);
        return resolve();
    });
  }

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