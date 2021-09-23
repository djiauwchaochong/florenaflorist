'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const { reverseString } = require('../helpers/rp.js')
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Type.hasMany(models.Bucket)
    }

    get convertPrice(){
      var temp = ''
      var count = 1
      var string = this.ongkos.toString()
  
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
  Type.init({
    name: DataTypes.STRING,
    ongkos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Type',
  });
  return Type;
};