export interface IFuel {
  name: string
  id?: number
}

export interface IFuelDetail {
  name: string
}

export function create(fuel: any): IFuel {
  if (fuel) {
    const { name, id } = fuel;

    return ({ name, id })
  }
}

export function createFuels(fuels: any[]): IFuel[] {
  return fuels.map(create);
}