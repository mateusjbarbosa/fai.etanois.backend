import { Request, Response } from 'express';
import { to, validateHhMm } from '../../core/util/util';
import { IAvailableService, IAvailableServiceDetail, getAllAvaliableService }
  from './available-service.module';
import { IUpdateElement, IElementUpdated, EUpdateError } from '../Generic/types-generic';
import FuelStation from './fuel-station.service';
import UpdateElementGeneric from '../Generic/update-element';
import AvailableService from './available-service.service';
import Handlers from '../../core/handlers/response-handlers';
import console = require('console');

class FuelStationAvailableServiceController {

  public readAllAvailableServices = (req: Request, res: Response) => {
    const available_services = getAllAvaliableService();

    Handlers.onSuccess(res, {available_services: available_services});
  }
  
  public createOrUpdateAvailableService = async (req: Request, res: Response) => {
    return new Promise(async resolve => {
      const fuel_station_id = parseInt(req.params.id);
      const user_id = req.user['id'];
      const errors: string[] = [];
      let body = req.body['available_services'];
      const update_interfae: IUpdateElement = {
        create_element: this.crateManyAvailableService,
        args_create_element: [body, fuel_station_id, errors],
        read_element: FuelStation.readById,
        args_read_element: [fuel_station_id, user_id],
        delete_element: AvailableService.deleteAvailableServiceByFuelStation,
        args_delete_element: [fuel_station_id],
      }

      if (!body) {
        Handlers.onError(res, 'Invalid available service');
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
            message_err = 'Internal error when creating services';
          break;

          case EUpdateError.ERR_READ:
            message_err = 'Invalid fuel station';
          break;

          case EUpdateError.ERR_DELETE:
              message_err = 'Internal error when updating services';
          break;
        }

        Handlers.onError(res, message_err);
      } else {
        Handlers.onSuccess(res, { available_services: element_updated.element_updated, msg: errors });
      }

      return resolve();

      /*
      const [err_read_fuel_station, read_fuel_station] = await to<IFuelStationDetail>(
        FuelStation.readById(fuel_station_id, user_id));

      if (err_read_fuel_station) { // There's no registered fuel station whit the ID
        Handlers.onError(res, 'Invalid fuel station');
        return resolve();
      }

      const [err_delete_available_service, success_delete] = await to<any>(
        AvailableService.deleteAvailableServiceByFuelStation(fuel_station_id));

      if (err_delete_available_service) {
        Handlers.onError(res, 'Error updating available service');
        return resolve();
      }*/
    });
  }

  private async crateManyAvailableService(available_service: IAvailableService[],
    fuel_station_id: number, errors: string[]) {
      const available_services_created: IAvailableServiceDetail[] = [];
      const services: string[] = getAllAvaliableService();
      const promises = available_service.map(async (object: IAvailableService) => {
        if (services.indexOf(object.service_type) > -1) {
          let valid: boolean = true;
          console.log(object.service_24_hours)
          if (object.service_24_hours && (object.service_24_hours == true 
            || object.service_24_hours == 'true')) {
            delete object.time_to_close;
            delete object.time_to_open;
            object.service_24_hours = true;
          } else {
            if (!validateHhMm(object.time_to_close)) {
              errors.push(`Time to close of ${object.service_type} is invalid`);
              valid = false;
            }
  
            if (!validateHhMm(object.time_to_open)) {
              errors.push(`Time to open of ${object.service_type} is invalid`);
              valid = false;
            }

            object.service_24_hours = false;
          }

          if (valid) {
            const new_available_service: IAvailableService = {
              fuel_station_id: fuel_station_id,
              service_type: object.service_type,
              time_to_close: object.time_to_close,
              time_to_open: object.time_to_open,
              service_24_hours: object.service_24_hours
            }
  
            const [err, success] =
              await to<IAvailableServiceDetail>(
                AvailableService.createAvailableService(new_available_service));
            
            if (err) {
              errors.push(`Unable to provide ${object.service_type}`);
            } else {
              available_services_created.push(new_available_service);
            }
          }
        } else {
          if (object.service_type) {
            errors.push(`${object.service_type} does not exist`);
          } else {
            errors.push(`Service type is required`);
          }
        }
      });

      await Promise.all(promises);

      return(available_services_created);
    }
}

export default new FuelStationAvailableServiceController();