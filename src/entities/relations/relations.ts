const Relations = (model) => {

  // User preference
  model.User.hasMany(model.UserPreferenceFuel, {foreignKey: 'user_id'})
  model.UserPreferenceFuel.belongsTo(model.User, {foreignKey: 'user_id'});

  model.Fuel.hasMany(model.UserPreferenceFuel, {foreignKey: 'fuel_id'})
  model.UserPreferenceFuel.belongsTo(model.Fuel, {foreignKey: 'fuel_id'});
}

module.exports = Relations;