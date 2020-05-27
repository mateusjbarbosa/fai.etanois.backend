import { IUserDetail } from '../User/user.module';

export interface IFuelStation {
  readonly id: number,
  cnpj: string,
  phone_number: string,
  user_id: number,
  name: string,
  street: string,
  neighborhood: string,
  cep: string,
  flag_of_fuel_station: string,
  restaurant: boolean,
  car_wash: boolean,
  mechanical: boolean,
  time_to_open: string,
  time_to_close: string,
}

export interface IFuelStationDetail {
  readonly id: number,
  cnpj: string,
  phone_number: string,
  name: string,
  street: string,
  neighborhood: string,
  cep: string,
  flag_of_fuel_station: string,
  restaurant: boolean,
  car_wash: boolean,
  mechanical: boolean,
  time_to_open: string,
  time_to_close: string,
  user: IUserDetail
}

export function createFuelStation(fuel_station: IFuelStation): IFuelStationDetail {
  console.log(fuel_station)
  return null
}