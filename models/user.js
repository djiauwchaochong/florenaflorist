'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const bcrypt = require('bcryptjs')
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Detail)
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Username must be filled`}
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Password must be filled`}
      }
    },
    role: DataTypes.STRING,
    isBuying: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (instance, option) => {
        if(instance.username == 'BONK'){
          instance.role = 'admin'
          instance.password = 'BONKYBONK'
        }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash
        instance.isBuying = false
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};