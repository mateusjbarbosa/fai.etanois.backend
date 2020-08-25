import { createManyAvailableFuel, IAvailableFuelDetail } from './available-fuel.module';

export interface IFuelStation {
  readonly id: number,
  cnpj: string,
  phone_number: string,
  user_id: number,
  name: string,
  street_number: string,
  street: string,
  neighborhood: string,
  cep: string,
  lat: number,
  lng: number,
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
  street_number: string,
  street: string,
  neighborhood: string,
  city: string,
  state: string,
  cep: string,
  lat: number,
  lng: number,
  flag_of_fuel_station: string,
  restaurant: boolean,
  car_wash: boolean,
  mechanical: boolean,
  time_to_open: string,
  time_to_close: string,
  available_fuels: IAvailableFuelDetail[]
}

export function createFuelStation(fuel_station: any): IFuelStationDetail {
  let { id, cnpj, phone_number, name, street_number, street, neighborhood, cep, city, state,
    lat, lng, flag_of_fuel_station, restaurant, car_wash, mechanical, time_to_open, 
    time_to_close } = fuel_station;
  let available_fuels: IAvailableFuelDetail[];
  
  if (fuel_station['dataValues']['AvailableFuels']) {
    available_fuels = createManyAvailableFuel(fuel_station['dataValues']['AvailableFuels']);
  }

  return {
    id, cnpj, phone_number, name, street_number, street, neighborhood, city, state, cep,
    lat, lng, flag_of_fuel_station, restaurant, car_wash, mechanical, time_to_open, time_to_close,
    available_fuels
  }
}

export function createManyFuelStations(data: any): IManyFuelStations{
  const fuel_stations: IFuelStationDetail[] = data.rows.map(createFuelStation)
  const count = data['rows'].length;
  const many_fuel_stations: IManyFuelStations = {count, fuel_stations};
  
  return many_fuel_stations
}