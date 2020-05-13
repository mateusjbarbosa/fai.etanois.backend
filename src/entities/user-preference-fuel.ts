export default function (sequelize, DataTypes) {
  const UserPreferenceFuel = sequelize.define('UserPreferenceFuel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fuel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Fuel name cannot be empy'
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
        }
      },
      unique: 'userPreference'
    }
  });

  return UserPreferenceFuel;
}