export interface IAvailableFuel {
  readonly id?: number,
  fuel_station_id: number,
  fuel_id: number,
  price: number,
}

export interface IAvailableFuelDetail {
  fuel_station_id: number,
  fuel_name: string,
  price: number,
}

export function createAvailableFuel(available_fuel: any): IAvailableFuelDetail {
  const {price, fuel_station_id, fuel_name} = available_fuel;

  return { price, fuel_station_id, fuel_name };
}

export function createManyAvailableFuel(available_fuel: any[]): IAvailableFuelDetail[] {
  return available_fuel.map(createAvailableFuel);
}