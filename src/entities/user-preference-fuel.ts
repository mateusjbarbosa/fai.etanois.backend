import { fuels } from '../modules/Fuel/fuel.module';

module.exports = function (sequelize, DataTypes) {
  const UserPreferenceFuel = sequelize.define('UserPreferenceFuel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Fuel name cannot be empy'
        },
        notNull: {
          msg: 'Fuel is required'
        },
        isIn: {
          args: [fuels],
          msg: 'Invalid fuel'
        }
      },
      unique: 'userPreference'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'User ID cannot be empy'
        },
        notNull: {
          msg: 'User ID is required'
        }
      },
      unique: 'userPreference'
    }
  });

  return UserPreferenceFuel;
}