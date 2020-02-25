import * as http from "http";
import Api from '../api/api';
import Configuration from '../../config/env/config';

export class Server {
  private server: http.Server;

  constructor() {
    this.upServer();
  }

  upServer(): void {
    this.server = http.createServer(Api);
    this.server.listen(Configuration.serverPort);
    this.server.on('listening', () => {
      let address: any = this.server.address();
      console.log(`Server listening on ${address.address}${address.port}`)
    });
  }
}