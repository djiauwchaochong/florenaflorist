'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail.belongsTo(models.User)
    }

    get nameForger(){
      if(this.gender == 'Female'){
        return `Ms. ${this.name}`
      }
      else{
        return `Mr. ${this.name}`
      }
    }
  };
  Detail.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Name must be filled`}
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Address must be filled`}
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Phone must be filled`}
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Gender must be filled`}
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Detail',
  });
  return Detail;
};