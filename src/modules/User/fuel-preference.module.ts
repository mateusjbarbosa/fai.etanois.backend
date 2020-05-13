import { IFuelDetail } from '../Fuel/fuel.module'

export interface IUserPreferenceFuel {
  user_id: number,
  fuel_id: number
}

export function create(fuelPreference: any): IUserPreferenceFuel {
  const {user_id, fuel_id} = fuelPreference;

  return ({ user_id, fuel_id });
}

export function createFuelDetail(fuel_preference: any): IFuelDetail[] {
  const fuels: IFuelDetail[] = [];

  fuel_preference.forEach(element => {
    fuels.push({name: element.Fuel.dataValues.name})
  });

  return fuels
}