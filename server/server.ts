import * as http from "http";
import Api from './api/api';
import Configuration from '../config/env/config';

const server = http.createServer(Api);

server.listen(Configuration.serverPort);
server.on('listening', () => {
  let address: any = server.address();

  console.log(`Server listening on ${address.address}${address.port}`
  )});