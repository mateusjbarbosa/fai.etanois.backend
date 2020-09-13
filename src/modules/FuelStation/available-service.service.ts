import { IAvailableServiceDetail, IAvailableService, createAvailableService, EServiceType } 
  from './available-service.module'
import { to } from '../../core/util/util';

const model = require('../../entities');
const { Op } = require("sequelize");

class AvailableService {
  constructor() { }

  public async createAvailableService(available_service: IAvailableService): 
    Promise<IAvailableServiceDetail> {
    const [err, success] = await to<IAvailableService>
      (model.AvailableService.create(available_service));

    if (err) {
      throw err;
    }

    return createAvailableService(success);
  }

  public async readOnlyAvailableService(service_type: EServiceType, fuel_station_id: number):
    Promise<IAvailableServiceDetail> {
      let query = {};

      query['service_type'] = service_type;
      query['fuel_station_id'] = fuel_station_id;

      const [err, success] = await to<any>(model.AvailableService.findOne({
        where: {
          [Op.and]: [query]
        }
      }));

      if (err) {
        throw { errors: [{ message: 'Available fuel station not found' }] };
      }

      return createAvailableService(success);
  }

  public async deleteAvailableServiceByFuelStation(fuel_station_id: number) {
    const [err, success] = await to<any>(model.AvailableService.destroy({
      where: {fuel_station_id}
    }));

    if (err) {
      throw err
    }

    return success;
  }
}

export default new AvailableService();