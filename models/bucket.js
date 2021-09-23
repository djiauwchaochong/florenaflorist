'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const { reverseString } = require('../helpers/rp.js')
  class Bucket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bucket.belongsTo(models.Type)
    }

    get convertPrice(){
      var temp = ''
      var count = 1
      var string = this.price.toString()
  
      for(var i = string.length - 1; i >= 0; i--){
          temp = temp + string[i]
          if(count == 3 && i != 0){
              temp = temp + '.'
              count = 0
          }
          count ++
      }
  
      temp = reverseString(temp)
      return `Rp. ${temp},00`
  
    }

  };
  Bucket.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Bucket name not filled`}
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {msg: `Price not filled`}
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {msg: `Stock not filled`}
      }
    },
    img: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `ImageUrl not filled`}
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {msg: `Description not filled`}
      }
    },
    TypeId: DataTypes.INTEGER
  },
    {
    sequelize,
    modelName: 'Bucket',
  });
  return Bucket;
};