export default function (sequelize, DataTypes) {
  const Fuel = sequelize.define('Fuel', {
    name: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      validate: {
        len: {
          args: [5, 50],
          msg: 'Name is too short or too large'
        }
      }
    }
  });

  return Fuel;
}