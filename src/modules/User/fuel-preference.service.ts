import { IFuel } from "../Fuel/fuel.module";
import { IUserPreferenceFuel, createFuelPreferences, create } from './fuel-preference.module'
const model = require('../../entities');

class FuelPreference {
  constructor() {}

  createMany(fuel: IFuel[], user_id: number): Promise<IUserPreferenceFuel[]> {
    fuel.map(object => {
      object['user_id'] = user_id;
    })

    return model.UserPreferenceFuel.bulkCreate(fuel)
    .then(createFuelPreferences);
  }

  create(fuel: IUserPreferenceFuel): Promise<IUserPreferenceFuel> {
    return model.UserPreferenceFuel.create(fuel)
    .then(create);
  }
}

export default new FuelPreference();