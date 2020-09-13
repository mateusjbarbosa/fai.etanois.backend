export interface IFuelDetail {
  name: string
}

export enum EAvailableFuel {
  GASOLINA_COMUM = 'Gasolina Comum',
  GASOLINA_ADITIVAD = 'Gasolina Aditivada',
  ETANOL = 'Etanol'
}

export function getAvailableFuels(): string[] {
  return Object.keys(EAvailableFuel).map(key => {
    return EAvailableFuel[key];
  });
}

export function readAllFuels(): IFuelDetail[] {
  let available_fuels: IFuelDetail[] = [];
  const fuels = getAvailableFuels();

  fuels.forEach(item => {
    available_fuels.push({name: item});
  });

  return available_fuels;
}