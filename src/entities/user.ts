import * as bcrypt from 'bcrypt';

export default function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    etacoins: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Etacoins cannot be empy'
        },
        isInt: {
          args: true,
          msg: 'Etacoins must be integer'
        },
        isGreaterThanZero(value) {
          if (value < 0) {
            throw new Error('Etacoins must be greater than zero');
          }
        }
      },
      defaultValue: 0
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        args: true,
        msg: 'E-mail is already in use',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'E-mail can\'t be empty'
        },
        len: {
          args: [10, 100],
          msg: 'E-mail is too short or too large'
        },
        isEmail: {
          args: true,
          msg: 'E-mail is invalid'
        },
        notNull: {
          msg: 'E-mail is required'
        }
      }
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username is already in use',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username can\'t be empty'
        },
        len: {
          args: [3, 30],
          msg: 'Username is too short or too large'
        },
        notNull: {
          msg: 'Username is required'
        }
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name can\'t be empy'
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password can\'t be empty'
        },
        len: {
          args: [6, 20],
          msg: 'Password is too short or too large'
        },
        notNull: {
          msg: 'Password is required'
        }
      }
    },
    cep: {
      type: DataTypes.STRING(8),
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'CEP can\'t be empty'
        },
        len: {
          args: [8, 8],
          msg: 'CEP is invalid'
        }
      },
    },
    search_distance_with_route: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The search distance with route can\'t be empty'
        },
        min: {
          args: 100,
          msg: 'The search distance with route can\'t be less than 100 meters'
        },
        max: {
          args: 10000,
          msg: 'The search distance with route can\'t exceed 10 kilometers'
        },
        isNumeric: {
          args: true,
          msg: 'Search distance with route must be numeric'
        }
      }
    },
    search_distance_without_route: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The search distance without route can\'t be empty'
        },
        min: {
          args: 100,
          msg: 'The search distance without route can\'t be less than 100 meters'
        },
        max: {
          args: 10000,
          msg: 'The search distance without route can\'t exceed 10 kilometers'
        },
        isNumeric: {
          args: true,
          msg: 'Search distance without route must be numeric'
        }
      }
    },
    payment_mode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          arg: true,
          msg: 'Payment format can\'t be empty'
        },
        isIn:
        {
          args: [['money', 'credit_card', 'both']],
          msg: 'Payment format is invalid'
        }
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          arg: true,
          msg: 'Role can\'t be empty'
        },
        isIn: {
          args: [['admin', 'driver', 'attendant', 'gas_station_owner']],
          msg: 'Unrecognized role'
        },
        notNull: {
          msg: 'Role is required'
        }
      },
      defaultValue: 'driver'
    },
    date_acceptance_therms_use: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        notEmpty: {
          arg: true,
          msg: 'Date acceptance of thems of use can\'t be empty'
        }
      }
    },
    activate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          arg: true,
          msg: 'Activate can\'t be empty'
        },
        notNull: {
          msg: 'Activate is required'
        }
      },
      defaultValue: false
    }
  });

  User.beforeCreate((user) => {
    return hashPassword(user);
  });

  function hashPassword(user) {
    if (user.password) {
      const salt = bcrypt.genSaltSync(10);
      user.set('password', bcrypt.hashSync(user.password, salt));
    }
  }

  return User;
}