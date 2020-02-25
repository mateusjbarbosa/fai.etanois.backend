import { IEnvorimment, Envorimment } from "./env";

class Configuration {
  private envorimment: IEnvorimment;

  constructor() {
    this.envorimment = new Envorimment(process.env.NODE_ENV).getInfoEnvorimment();
  }

  getEnvConfiguration(): IEnvorimment {
    return this.envorimment
  }
}

export default new Configuration().getEnvConfiguration();