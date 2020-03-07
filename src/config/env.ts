export interface IDatabaseEnvorimmet {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
}

export interface IEnvorimment {
  envorimmentName: string;
  serverPort: string;
  database: IDatabaseEnvorimmet;
  secret: string
}

export class Envorimment {

  private envorimentList: IEnvorimment[] = [{
    envorimmentName: "development",
    database: {
      username: "postgres",
      password: "postgres",
      database: "etanois",
      host: "127.0.0.1",
      dialect: "postgres",
    },
    serverPort: "80",
    secret: 'S3CR3T'
  },{
    envorimmentName: "test",
    database: {
      username: "postgres",
      password: "postgres",
      database: "etanois_test",
      host: "127.0.0.1",
      dialect: "postgres",
    },
    serverPort: "80",
    secret: 'S3CR3T'
  }];
  
  private envorimment: string
  
  constructor(envorimment: string) {
    this.envorimment = envorimment;
  }

  getInfoEnvorimment(): IEnvorimment {
    let envorimmentSelected: IEnvorimment;

    this.envorimentList.forEach((element) => {
      if (element.envorimmentName == this.envorimment) {
        envorimmentSelected = element;
        return;
      }
    });
    
    return envorimmentSelected;
  }
}
