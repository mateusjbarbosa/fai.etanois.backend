import { getAllAvaliableService } from '../modules/FuelStation/available-service.module';
import { validateHhMm } from '../core/util/util';

module.exports = function (sequelize, DataTypes) {
  const AvailableService = sequelize.define('AvailableService', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Service type cannot be empy'
        },
        notNull: {
          msg: 'Service type is required'
        },
        isIn: {
          args: [getAllAvaliableService()],
          msg: 'Invalid service type'
        }
      },
      unique: 'availableService'
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
      unique: 'availableService'
    },
    time_to_open: {
      type: DataTypes.TIME,
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Time to open can\'t be empty'
        },
        is_time_to_open_valid(value) {
          if (value && !validateHhMm(value)) {
            throw new Error('Invalid opening hours');
          }
        }
      }
    },
    time_to_close: {
      type: DataTypes.TIME,
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Time to close can\'t be empty'
        },
        is_time_to_close_valid(value) {
          if (value && !validateHhMm(value)) {
            throw new Error('Invalid close time');
          }
        }
      }
    },
    service_24_hours: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `'Is Service 24 Hours?' can\'t be empty`
        },
        notNull: {
          msg: `'Is Service 24 Hours?' is required`
        }
      },
      defaultValue: true
    }
  });

  return AvailableService;
}