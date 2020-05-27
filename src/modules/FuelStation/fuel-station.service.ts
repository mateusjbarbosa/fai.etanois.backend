import { to } from '../../core/util/util';
import { IFuelStation, IFuelStationDetail, createFuelStation } from './fuel-station.module';

const model = require('../../entities');
const { Op } = require("sequelize");

class FuelStation {
  constructor() {}

  public async create(fuel: IFuelStation): Promise<IFuelStationDetail> {
    const [err, success] = await to<any>(model.FuelStation.create(fuel));

    if (err) {
      throw err;
    }

    return createFuelStation(success);
  }
}