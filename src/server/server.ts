import * as http from "http";
import Configuration from '../config/config';
import { CoreModule } from '../core/core';
import { Application } from 'express';

export class Server {
  private server: http.Server;
  private db;
  private express: Application;

  constructor(databaseConnector) {
    if (databaseConnector) {
      this.db = databaseConnector;
      this.express = new CoreModule().getApplication();
      this.syncDatabase();
    }
  }

  upServer(): void {
    this.server = http.createServer(this.express);
    this.server.listen(Configuration.serverPort);
    this.server.on('listening', () => {
      let address: any = this.server.address();
      console.log(`Server listening on ${address.address}${address.port}`)
    });
  }

  private async syncDatabase() {
    try {
      const syncData = await this.db.sequelize.sync(); 
      this.databaseSyncHandler(syncData);
    } catch(error) {
      this.databaseSyncErrorHandler(error);
    }
  }

  private databaseSyncHandler(databaseInfo) {
    const {options, config, modelManager} = databaseInfo;
    const {models} = modelManager;
    this.upServer();
    this.logDatabaseConnection({models, options, config});
  }

  private databaseSyncErrorHandler(error) {
    console.log(`Can't connect to a database because: ${error}`);
  }

  private logDatabaseConnection({models, options, config}){
    const {dialect, host} = options;
    const {database, port} = config;

    if(dialect && host && database && port && models) {
      console.log(`Database dialect: ${dialect}`);
      console.log(`Database host: ${host}`);
      console.log(`Database name: ${database}`);
      console.log(`Database port: ${port}`);
      console.log(`Database models: ${models}`);
    }
  }
}