export interface IDatabaseEnvorimmet {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
}

export interface IRedisEnvoriment {
  port: number,
  host: string
}

export interface IEnvorimment {
  envorimmentName: string;
  serverPort: string;
  database: IDatabaseEnvorimmet;
  redis: IRedisEnvoriment
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
    redis: {
      port: 6379,
      host: '127.0.0.1'
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
    redis: {
      port: 6379,
      host: 'redis'
    },
    serverPort: "80",
    secret: 'S3CR3T'
  }, {
    envorimmentName: "production",
    database: {
      username: process.env.DATABASE_USERNAME || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres",
      database: "etanois",
      host: process.env.DATABASE_HOST || "postgres",
      dialect: "postgres"
    },
    redis: {
      port: 6379,
      host: 'redis'
    },
    serverPort: process.env.DATABASE_SERVER_PORT || "3000",
    secret: process.env.DATABASE_SECRET || "S3CR3T"
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
