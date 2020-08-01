module.exports = function (sequelize, DataTypes) {
  const AvailableFuel = sequelize.define('AvailableFuel', {
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
        },
        notNull: {
          msg: 'Fuel ID is required'
        }
      },
      unique: 'availableFuel'
    },
    fuel_station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Fuel station cannot be empty'
        },
        notNull: {
          msg: 'Fuel station is required'
        }
      },
      unique: 'availableFuel'
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Price cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Price is required'
        },
        min: {
          args: 0,
          msg: 'Price cannot be less than zero'
        }
      }
    }
  });

  return AvailableFuel;
}