import { readAllFuels } from '../Fuel/fuel.module';
import AvailableFuel from './available-fuel.service';
import { IAvailableFuelDetail, IAvailableFuel }
  from './available-fuel.module';
import { IFuelStationDetail } from './fuel-station.module';
import { Request, Response } from 'express';
import { to, findWithAttr } from '../../core/util/util';
import Handlers from '../../core/handlers/response-handlers';
import FuelStation from './fuel-station.service';

class FuelStationAvailableFuelController {
  public createOrUpdateAvailableFuel = async (req: Request, res: Response) => {
    return new Promise(async resolve => {
      const fuel_station_id = parseInt(req.params.id);
      const user_id = req.user['id'];
      let body = req.body['available_fuels'];

      const [err_read_fuel_station, read_fuel_station] = await to<IFuelStationDetail>(
        FuelStation.readById(fuel_station_id, user_id));

      if (err_read_fuel_station) { // There's no registered fuel station whit the ID
        Handlers.onError(res, 'Invalid fuel station');
        return resolve();
      }

      const [err_delete_available_fuel, success_delete] = await to<any>(
        AvailableFuel.deleteAvailableFuelByFuelStation(fuel_station_id));

      if (err_delete_available_fuel) {
        Handlers.onError(res, 'Error updating available fuel');
        return resolve();
      }

      const errors: string[] = [];
      const [err_create, available_fuels] = await
        to<IAvailableFuelDetail[]>(this.crateManyAvailableFuel(body, fuel_station_id, errors));

      if (err_create) {
        Handlers.onError(res, 'Formating invalid');
        return resolve();
      }

      Handlers.onSuccess(res, { available_fuels: available_fuels, msg: errors });
    });
  }

  private async crateManyAvailableFuel(available_fuel: IAvailableFuelDetail[],
    fuel_station_id: number, errors: string[]): Promise<IAvailableFuelDetail[]> {
    const available_fuels: IAvailableFuelDetail[] = [];
    const fuels = readAllFuels();
    const promises = available_fuel.map(async (object: any) => {
      const index = findWithAttr(fuels, 'name', object.fuel);

      if (index >= 0) {
        if (!isNaN(parseFloat(object.price))) {
          const new_available_fuel: IAvailableFuel = {
            fuel: fuels[index].name,
            fuel_station_id: fuel_station_id, 
            price: parseFloat(object.price)
          }

          const [err, success] =
            await to<IAvailableFuelDetail>(AvailableFuel.createAvailableFuel(new_available_fuel));

          if (err) {
            errors.push(`Unable to provide ${object.fuel}`);
          } else {
            available_fuels.push(object);
          }
        } else {
          errors.push(`Price of ${object.fuel} is invalid`);
        }
      } else {
        if (object.fuel) {
          errors.push(`${object.fuel} does not exist`);
        } else {
          errors.push(`Fuel name is required`);
        }
      }
    });

    await Promise.all(promises);

    return (available_fuels);
  }
}

export default new FuelStationAvailableFuelController();