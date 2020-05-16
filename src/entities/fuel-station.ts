export default function (sequelize, DataTypes) {
  const FuelStation = sequelize.define('FuelStation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cnpj: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: {
        args: true,
        msg: 'CNPJ is already in use',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'CNPJ can\'t be empty'
        },
        len: {
          args: [14, 14],
          msg: 'CNPJ is too short or too large'
        },
        notNull: {
          msg: 'CNPJ is required'
        }
      }
    },
    phone_number: {
      type: DataTypes.STRING(11),
      allowNull: true,
      unique: {
        args: true,
        msg: 'Phone number is already in use',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Phone number can\'t be empty'
        },
        len: {
          args: [11, 11],
          msg: 'Phone number is too short or too large'
        },
        isNumeric: {
          args: true,
          msg: 'Phone number is invalid'
        }
      }
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
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name can\'t be empty'
        },
        len: {
          args: [6, 50],
          msg: 'Name is too short or too large'
        },
        notNull: {
          msg: 'Name is required'
        }
      }
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Street can\'t be empty'
        },
        len: {
          args: [6, 100],
          msg: 'Street is too short or too large'
        },
        notNull: {
          msg: 'Street is required'
        }
      }
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Neighborhood can\'t be empty'
        },
        len: {
          args: [6, 100],
          msg: 'Neighborhood is too short or too large'
        },
        notNull: {
          msg: 'Neighborhood is required'
        }
      }
    },
    cep: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'CEP can\'t be empty'
        },
        len: {
          args: [8, 8],
          msg: 'CEP is invalid'
        },
        notNull: {
          msg: 'CEP is required'
        }
      }
    },
    flag_of_fuel_station: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          arg: true,
          msg: 'Flag of fuel station can\'t be empty'
        }
      },
    },
    restaurant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Restaurant can\'t be empty'
        },
        notNull: {
          msg: 'Restaurant is required'
        }
      },
      defaultValue: false
    },
    car_wash: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Car wash can\'t be empty'
        },
        notNull: {
          msg: 'Car wash is required'
        }
      },
      defaultValue: false
    },
    mechanical: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Mechanical can\'t be empty'
        },
        notNull: {
          msg: 'Mechanical is required'
        }
      },
      defaultValue: false
    },
    time_to_open: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Time to open can\'t be empty'
        },
        notNull: {
          msg: 'Time to open is required'
        }
      }
    },
    time_to_close: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Time to close can\'t be empty'
        },
        notNull: {
          msg: 'Time to close is required'
        }
      }
    }
  });

  return FuelStation;
}