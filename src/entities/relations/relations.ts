const Relations = (model) => {

  // User preference
  model.User.hasMany(model.UserPreferenceFuel, {foreignKey: 'user_id'});
  model.UserPreferenceFuel.belongsTo(model.User, {foreignKey: 'user_id'});

  model.Fuel.hasMany(model.UserPreferenceFuel, {foreignKey: 'fuel_id'});
  model.UserPreferenceFuel.belongsTo(model.Fuel, {foreignKey: 'fuel_id'});

  // Fuel Station
  model.User.hasMany(model.FuelStation, {foreignKey: 'user_id'});
  model.FuelStation.belongsTo(model.User, {foreignKey: 'user_id'});

  // Available Fuel Station
  model.FuelStation.hasMany(model.AvailableFuel, {foreignKey: 'fuel_station_id'});
  model.AvailableFuel.belongsTo(model.FuelStation, {foreignKey: 'fuel_station_id'});

  model.Fuel.hasMany(model.AvailableFuel, {foreignKey: 'fuel_id'});
  model.AvailableFuel.belongsTo(model.Fuel, {foreignKey: 'fuel_id'});
}

module.exports = Relations;