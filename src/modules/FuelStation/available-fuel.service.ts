import { to } from '../../core/util/util';
import { createAvailableFuel, IAvailableFuelDetail, IAvailableFuel } from './available-fuel.module'

const model = require('../../entities');
const { Op } = require("sequelize");

class AvailableFuel {
  constructor() {}


  public async createAvailableFuel(available_fuel: IAvailableFuel):
    Promise<IAvailableFuelDetail> {
      const [err, success] = await to<IAvailableFuel>(model.AvailableFuel.create(available_fuel));
      
      if (err) {
        throw err;
      }

    return createAvailableFuel(success);
  }

  public async readOnlyAvailableFuel(fuel: number, fuel_station_id: number): 
    Promise<IAvailableFuelDetail> {
      let query = {};

      query['fuel'] = fuel;
      query['fuel_station_id'] = fuel_station_id;

      const [err, success] = await to<any>(model.AvailableFuel.findOne({
        where: {
          [Op.and]: [query]
        }
      }));

      if (err) {
        throw { errors: [{ message: 'Available fuel station not found' }] };
      }
      
      return createAvailableFuel(success);
    }
  
  public async deleteAvailableFuelByFuelStation(fuel_station_id: number): Promise<any> {
    const [err, success] = await to<any>(model.AvailableFuel.destroy({
      where: {fuel_station_id}
    }));

    if (err) {
      throw err
    }

    return success;
  }
}

export default new AvailableFuel();