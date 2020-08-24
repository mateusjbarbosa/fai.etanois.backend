'use strict';

import config from '../config/config';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db: any = {};
const modelRelations = require('./relations/relations');

let sequelize;

sequelize = new Sequelize(config.database.database, config.database.username,
  config.database.password, config.database);

fs
  .readdirSync(__dirname)
  .filter(file => {
    let extension: string = '.js';
    if (config.envorimmentName == 'development') extension = '.ts';
    
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === `${extension}`);
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

modelRelations(db);

module.exports = db;
