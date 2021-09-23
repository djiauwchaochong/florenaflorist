'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static totalOmzet(){
      return Transaction.sum('price')
    }

  };
  Transaction.init({
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (instance, option) => {
        instance.isApproved = false
      }
    },
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};