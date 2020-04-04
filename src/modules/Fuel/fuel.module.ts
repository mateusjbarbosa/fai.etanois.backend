export interface IFuel {
  name: string
}

export function create(fuel: any): IFuel {
  if (fuel) {
    const { name } = fuel;

    return ({ name })
  }
}

export function createFuels(fuels: any[]): IFuel[] {
  return fuels.map(create);
}