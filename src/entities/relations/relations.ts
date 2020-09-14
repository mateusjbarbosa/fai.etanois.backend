const Relations = (model) => {

  // User preference
  model.User.hasMany(model.UserPreferenceFuel, {foreignKey: 'user_id'});
  model.UserPreferenceFuel.belongsTo(model.User, {foreignKey: 'user_id'});
  // Fuel Station
  model.User.hasMany(model.FuelStation, {foreignKey: 'user_id'});
  model.FuelStation.belongsTo(model.User, {foreignKey: 'user_id'});

  // Available Fuel of Fuel Station
  model.FuelStation.hasMany(model.AvailableFuel, {foreignKey: 'fuel_station_id'});
  model.AvailableFuel.belongsTo(model.FuelStation, {foreignKey: 'fuel_station_id'});

    // Available Service of Fuel Station
    model.FuelStation.hasMany(model.AvailableService, {foreignKey: 'fuel_station_id'});
    model.AvailableService.belongsTo(model.FuelStation, {foreignKey: 'fuel_station_id'});
}

module.exports = Relations;