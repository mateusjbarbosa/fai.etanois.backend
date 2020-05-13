import { IFuel, IFuelDetail } from "../Fuel/fuel.module";
import { IUserPreferenceFuel, create, createFuelDetail } from './fuel-preference.module'
import { to } from "../../core/util/util";
import Fuel from '../Fuel/fuel.service';
const { Op } = require("sequelize");
const model = require('../../entities');

class FuelPreference {
  constructor() {}

  public create(fuel: IUserPreferenceFuel): Promise<IUserPreferenceFuel> {
    return model.UserPreferenceFuel.create(fuel)
    .then(create);
  }

  public async readByUser(user_id: number): Promise<IFuelDetail[]> {
    const [err, success] = await to<any>(model.UserPreferenceFuel.findAll({
      where: {user_id},
      include: [{
        model: model.Fuel
      }]
    }));

    if (err) {
      throw err;
    }
    
    return (createFuelDetail(success));
  }

  public async deleteByUser(user_id: number): Promise<any> {
    const [err, success] = await to<any>(model.UserPreferenceFuel.destroy({
      where: {user_id}
    }));

    if (err) {
      throw err
    }

    return success;
  }
}

export default new FuelPreference();