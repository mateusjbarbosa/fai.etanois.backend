import * as bcrypt from 'bcrypt';

export default function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'E-mail cannot be empty'
        },
        len: {
          args: [10, 100],
          msg: 'E-mail is too short'
        },
        isEmail:{
          args: true,
          msg: 'E-mail is invalid'
        }
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name cannot be empy'
        },
        len: {
          args: [6, 50],
          msg: 'Name is too short'
        },
        notNull: {
          msg: 'Username is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password cannot be empty'
        },
        notNull: {
          msg: 'Password is required'
        }
      }
    },
    cep: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [8, 8],
          msg: 'CEP is invalid'
        },
        notNull: {
          msg: 'CEP is required'
        }
      },
    },
    payment_mode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          arg: true,
          msg: 'Payment format cannot be empty'
        },
        isIn: 
        {
          args: [['money', 'credit_card', 'both']],
          msg: 'Payment format is invalid'
        },
        notNull: {
          msg: 'Payment format is required'
        }
      },
    }
  });

  User.beforeCreate((user) => {
    return hashPassword(user);
  });

  User.beforeUpdate((user) => {
    return hashPassword(user);
  });
  
  function hashPassword(user) {
    const salt = bcrypt.genSaltSync(10);
    user.set('password', bcrypt.hashSync(user.password, salt));
  }

  return User;
}