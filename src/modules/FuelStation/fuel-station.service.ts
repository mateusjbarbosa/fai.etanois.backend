import { to } from '../../core/util/util';
import {
  IFuelStation, IFuelStationDetail, createFuelStation, createManyFuelStations,
  IManyFuelStations
}
  from './fuel-station.module';

const model = require('../../entities');
const { Op } = require("sequelize");

class FuelStation {
  private include_available_fuel_service =
    [{ model: model.AvailableFuel },
    { model: model.AvailableService }]
  private fuel_station_by_page: number = 5;
  private earth_radius = 6371;
  constructor() { }

  public async create(fuel: IFuelStation): Promise<IFuelStationDetail> {
    const [err, success] = await to<any>(model.FuelStation.create(fuel));

    if (err) {
      throw err;
    }

    return createFuelStation(success);
  }

  public async delete(id: number): Promise<IFuelStationDetail>{
    const fuel_station = {
      id: id,
      activate: false
    }

    const[err, success] = await to<any>(model.FuelStation.update(fuel_station, {
      where: {id},
      fields: ['activate'],
      hooks: true,
      individualHooks: true
    }));

    if (err) {
      throw err
    }

    return (createFuelStation(success));
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
      include: this.include_available_fuel_service
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
    let query = {};

    query['user_id'] = user_id;
    query['activate'] = true;

    const [err, success] = await to<any>(model.FuelStation.findAndCountAll({
      where: {
        [Op.and]: [query]
      },
      offset: (page - 1) * this.fuel_station_by_page,
      limit: this.fuel_station_by_page,
      include: this.include_available_fuel_service,
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

  public async readByCoordinates(lat: number, lng: number, radius: number, page: number): Promise<IManyFuelStations> {
    // This logic can be found in: https://www.movable-type.co.uk/scripts/latlong-db.html 
    const min_lat = lat - radius / this.earth_radius * 180 / Math.PI;
    const max_lat = lat + radius / this.earth_radius * 180 / Math.PI;
    const min_lng = lng - radius / this.earth_radius * 180 / Math.PI / Math.cos(lat * Math.PI / 180);
    const max_lng = lng + radius / this.earth_radius * 180 / Math.PI / Math.cos(lat * Math.PI / 180);

    const [err, success] = await to<any>(model.FuelStation.findAndCountAll({
      where: {
        lat: {
          [Op.between]: [min_lat, max_lat]
        },
        lng: {
          [Op.between]: [min_lng, max_lng]
        },
        activate: true
      },
      offset: (page - 1) * this.fuel_station_by_page,
      limit: this.fuel_station_by_page,
      include: this.include_available_fuel_service,
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