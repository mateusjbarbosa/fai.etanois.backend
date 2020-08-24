export interface IState {
  short_name: string;
  long_name: string;
}

export interface IStatesOfCountry {
  country: string;
  states: IState[];
}

export enum ESupportedCountry {
  BRAZIL = 'Brazil',
}

const brazil: IStatesOfCountry = {
  country: "Brazil",
  states: [
    { short_name: 'AC', long_name: 'Acre' },
    { short_name: 'AL', long_name: 'Alagoas' },
    { short_name: 'AP', long_name: 'Amapá' },
    { short_name: 'AM', long_name: 'Amazonas' },
    { short_name: 'BA', long_name: 'Bahia' },
    { short_name: 'CE', long_name: 'Ceará' },
    { short_name: 'DF', long_name: 'Distrito Federal' },
    { short_name: 'ES', long_name: 'Espírito Santo' },
    { short_name: 'GO', long_name: 'Goías' },
    { short_name: 'MA', long_name: 'Maranhão' },
    { short_name: 'MT', long_name: 'Mato Grosso' },
    { short_name: 'MS', long_name: 'Mato Grosso do Sul' },
    { short_name: 'MG', long_name: 'Minas Gerais' },
    { short_name: 'PA', long_name: 'Pará' },
    { short_name: 'PB', long_name: 'Paraíba' },
    { short_name: 'PR', long_name: 'Paraná' },
    { short_name: 'PE', long_name: 'Pernambuco' },
    { short_name: 'PI', long_name: 'Piauí' },
    { short_name: 'RJ', long_name: 'Rio de Janeiro' },
    { short_name: 'RN', long_name: 'Rio Grande do Norte' },
    { short_name: 'RS', long_name: 'Rio Grande do Sul' },
    { short_name: 'RO', long_name: 'Rondônia' },
    { short_name: 'RR', long_name: 'Roraima' },
    { short_name: 'SC', long_name: 'Santa Catarina' },
    { short_name: 'SP', long_name: 'São Paulo' },
    { short_name: 'SE', long_name: 'Sergipe' },
    { short_name: 'TO', long_name: 'Tocantins' }]
}

export const countries: IStatesOfCountry[] = [brazil];

export function getLongNameOfStatesOfCountry(country: ESupportedCountry): string[] {
  let states_long_name: string[] = [];

  const states: IState[][] = countries.map(element => {
    if (element.country == country) {
      return element.states
    }
  });

  console.log(states)

  if (states[0]) {
    states_long_name = states[0].map(element => {
      return element.long_name;
    })
  }

  console.log(states_long_name)

  return states_long_name;
}