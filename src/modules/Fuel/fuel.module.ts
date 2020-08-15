export interface IFuelDetail {
  name: string
}

export const fuels = ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol']

export function readAllFuels(): IFuelDetail[] {
  let available_fuels: IFuelDetail[] = [];

  fuels.forEach(item => {
    available_fuels.push({name: item});
  });

  return available_fuels;
}