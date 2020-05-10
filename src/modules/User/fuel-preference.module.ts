import { IFuelDetail } from '../Fuel/fuel.module'

export interface IUserPreferenceFuel {
  user_id: number,
  fuel_id: number
}

export function create(fuelPreference: any): IUserPreferenceFuel {
  const {user_id, fuel_id} = fuelPreference;

  return ({ user_id, fuel_id });
}

export function createFuelPreferences(fuelPreferences: any[]) {
  return fuelPreferences.map(create);
}