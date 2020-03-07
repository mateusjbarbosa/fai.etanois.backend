import { Server } from './src/server/server';
const sequelize = require('./src/entities');

(function() {
  new Server(sequelize);
})();