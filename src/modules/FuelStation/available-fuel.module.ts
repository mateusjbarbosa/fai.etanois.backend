export interface IAvailableFuel {
  readonly id?: number,
  fuel_station_id: number,
  fuel: string,
  price: number,
}

export interface IAvailableFuelDetail {
  fuel_station_id: number,
  fuel: string,
  price: number,
}

export function createAvailableFuel(available_fuel: any): IAvailableFuelDetail {
  const {price, fuel_station_id, fuel} = available_fuel;

  return { price, fuel_station_id, fuel };
}

export function createManyAvailableFuel(available_fuel: any[]): IAvailableFuelDetail[] {
  return available_fuel.map(createAvailableFuel);
}