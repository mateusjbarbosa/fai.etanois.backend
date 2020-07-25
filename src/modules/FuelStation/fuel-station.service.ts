import { to } from '../../core/util/util';
import { IFuelStation, IFuelStationDetail, createFuelStation } from './fuel-station.module';

const model = require('../../entities');
const { Op } = require("sequelize");

class FuelStation {
  constructor() { }

  public async create(fuel: IFuelStation): Promise<IFuelStationDetail> {
    const [err, success] = await to<any>(model.FuelStation.create(fuel));

    if (err) {
      throw err;
    }

    return createFuelStation(success);
  }

  public async readById(id_fuel_station: number, id_user_owner: number):
    Promise<IFuelStationDetail> {
    let query = {};

    query['id'] = id_fuel_station;
    query['user_id'] = id_user_owner;
    query['activate'] = true;

    const [err, success] = await to<any>(model.FuelStation.findOne({
      where: {
        [Op.and]: [query]
      }
    }));

    if (err) {
      throw err;
    }

    if (success) {
      return createFuelStation(success);
    } else {
      throw { errors: [{ message: 'Fuel Station not found' }] };
    }
  }
}

export default new FuelStation();