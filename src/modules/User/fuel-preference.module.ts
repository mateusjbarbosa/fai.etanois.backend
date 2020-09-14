import { IFuelDetail } from '../Fuel/fuel.module'

export interface IUserPreferenceFuel {
  user_id: number,
  fuel: string
}

export function create(fuelPreference: any): IUserPreferenceFuel {
  const {user_id, fuel} = fuelPreference;

  return ({ user_id, fuel });
}

export function createFuelDetail(fuel_preference: any): IFuelDetail[] {
  const fuels: IFuelDetail[] = [];

  fuel_preference.forEach(element => {
    fuels.push({name: element.dataValues.name})
  });

  return fuels
}