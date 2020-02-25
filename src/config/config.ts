class Configuration {

  constructor() {}

  getEnvConfiguration(): any {
    return require('./env')[process.env.NODE_ENV];;
  }
}
export default new Configuration().getEnvConfiguration();