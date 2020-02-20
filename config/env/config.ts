class Configuration {
  private extension: string = 'js';

  constructor() {
    if (process.env.NODE_ENV == 'development') {
      this.extension = 'ts';
    }
  }

  getEnvConfiguration(): any {
    const directory = `./${ process.env.NODE_ENV }.env.${ this.extension }`;
    return require(directory);
  }
}
export default new Configuration().getEnvConfiguration();