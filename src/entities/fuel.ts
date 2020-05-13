export default function (sequelize, DataTypes) {
  const Fuel = sequelize.define('Fuel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      unique: {
        args: true,
        msg: 'The fuel name already exists',
      },
      validate: {
        len: {
          args: [5, 50],
          msg: 'Fuel name is too short or too large'
        }
      }
    }
  });

  return Fuel;
}