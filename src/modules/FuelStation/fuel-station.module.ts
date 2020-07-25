import { IUserDetail, create } from '../User/user.module';

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
  User: IUserDetail
}

export function createFuelStation(fuel_station: IFuelStationDetail): IFuelStationDetail {
  let { id, cnpj, phone_number, name, street, neighborhood, cep, flag_of_fuel_station, restaurant,
    car_wash, mechanical, time_to_open, time_to_close, User } = fuel_station;

  if (User) {
    User = create(User);
  }

  return {
    id, cnpj, phone_number, name, street, neighborhood, cep, flag_of_fuel_station, restaurant,
    car_wash, mechanical, time_to_open, time_to_close, User
  }
}