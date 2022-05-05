'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersStage2 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usersStage2.init({
    userID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }

    },
    index: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:'User  must have a index'},
        notEmpty:{msg:'index must not be empty'}
      }},
    visit:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:'User  must have a visit'},
        notEmpty:{msg:'visit must not be empty'}
      }}
  }, {
    sequelize,
    modelName: 'usersStage2',
  });
  return usersStage2;
};