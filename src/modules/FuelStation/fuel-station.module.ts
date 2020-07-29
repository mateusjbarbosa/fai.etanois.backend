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

export interface IManyFuelStations {
  count: number,
  fuel_stations: IFuelStationDetail[]
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
}

export function createFuelStation(fuel_station: any): IFuelStationDetail {
  let { id, cnpj, phone_number, name, street, neighborhood, cep, flag_of_fuel_station, restaurant,
    car_wash, mechanical, time_to_open, time_to_close } = fuel_station;

  return {
    id, cnpj, phone_number, name, street, neighborhood, cep, flag_of_fuel_station, restaurant,
    car_wash, mechanical, time_to_open, time_to_close
  }
}

export function createManyFuelStations(data: any): IManyFuelStations{
  const fuel_stations: IFuelStationDetail[] = data.rows.map(createFuelStation)
  const count = data.count;
  const many_fuel_stations: IManyFuelStations = {count, fuel_stations};
  
  return many_fuel_stations
}