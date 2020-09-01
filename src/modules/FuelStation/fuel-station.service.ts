import { to } from '../../core/util/util';
import {
  IFuelStation, IFuelStationDetail, createFuelStation, createManyFuelStations,
  IManyFuelStations
}
  from './fuel-station.module';

const model = require('../../entities');
const { Op } = require("sequelize");

class FuelStation {
  private include_available_fuel = 
    [ { model: model.AvailableFuel }]
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
      },
      include: this.include_available_fuel
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

  public async readByUser(user_id: number, page: number): Promise<IManyFuelStations> {
    const fuel_station_by_page: number = 5;
    let query = {};

    query['user_id'] = user_id;
    query['activate'] = true;

    const [err, success] = await to<any>(model.FuelStation.findAndCountAll({
      where: {
        [Op.and]: [query]
      },
      offset: (page - 1) * fuel_station_by_page,
      limit: fuel_station_by_page,
      include: this.include_available_fuel,
      distinct: true
    }));

    if (err) {
      throw err;
    }

    if (success) {
      return (createManyFuelStations(success));
    } else {
      throw { errors: [{ message: 'There are no fuel stations' }] };
    }
  }
}

export default new FuelStation();