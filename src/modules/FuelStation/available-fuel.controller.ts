import { readAllFuels } from '../Fuel/fuel.module';
import AvailableFuel from './available-fuel.service';
import { IAvailableFuelDetail, IAvailableFuel }
  from './available-fuel.module';
import { Request, Response } from 'express';
import { to, findWithAttr } from '../../core/util/util';
import Handlers from '../../core/handlers/response-handlers';
import FuelStation from './fuel-station.service';
import { IUpdateElement, IElementUpdated, EUpdateError } from '../Generic/types-generic';
import UpdateElementGeneric from '../Generic/update-element';

class FuelStationAvailableFuelController {
  public createOrUpdateAvailableFuel = async (req: Request, res: Response) => {
    return new Promise(async resolve => {
      const fuel_station_id = parseInt(req.params.id);
      const user_id = req.user['id'];
      const errors: string[] = [];
      let body = req.body['available_fuels'];
      const update_interfae: IUpdateElement = {
        create_element: this.crateManyAvailableFuel,
        args_create_element: [body, fuel_station_id, errors],
        read_element: FuelStation.readById,
        args_read_element: [fuel_station_id, user_id],
        delete_element: AvailableFuel.deleteAvailableFuelByFuelStation,
        args_delete_element: [fuel_station_id],
      }

      if (!body) {
        Handlers.onError(res, 'Invalid available fuel');
        return resolve();
      }

      const update_element = new UpdateElementGeneric(update_interfae);

      const [err, element_updated] = 
      await to<IElementUpdated>(update_element.runUpdateElement());

      if (err) {
        Handlers.onError(res, 'Internal Error');
        return resolve();
      }

      if (element_updated.big_mistake != EUpdateError.ERR_NONE) {
        let message_err: string;

        switch (element_updated.big_mistake) {
          case EUpdateError.ERR_CREATE:
            message_err = 'Internal error when creating fuels';
          break;

          case EUpdateError.ERR_READ:
            message_err = 'Invalid fuel station';
          break;

          case EUpdateError.ERR_DELETE:
              message_err = 'Internal error when updating fuels';
          break;
        }

        Handlers.onError(res, message_err);
      } else {
        Handlers.onSuccess(res, { available_services: element_updated.element_updated, msg: errors });
      }

      return resolve();
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