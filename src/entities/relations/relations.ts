const Relations = (model) => {
  model.UserPreferenceFuel.belongsTo(model.User, {foreignKey: 'user_id'});
  model.UserPreferenceFuel.belongsTo(model.Fuel, {foreignKey: 'fuel_name'});
}

module.exports = Relations;