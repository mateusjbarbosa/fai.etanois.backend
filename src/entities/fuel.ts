export default function (sequelize, DataTypes) {
  const Fuel = sequelize.define('Fuel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: 'The fuel name already exists',
      },
      validate: {
        len: {
          args: [5, 50],
          msg: 'Fuel name is too short or too large'
        },
        notEmpty: {
          args: true,
          msg: 'Name can\'t be empty'
        },
        notNull: {
          msg: 'Name is required'
        }
      }
    }
  });

  return Fuel;
}