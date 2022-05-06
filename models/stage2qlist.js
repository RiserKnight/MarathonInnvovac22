'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stage2QList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stage2QList.init({
    userID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }}
    ,
    list: {type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{msg:'User must have a list'},
        notEmpty:{msg:'List must not be empty'}
      }
    }
  }, {
    sequelize,
    modelName: 'stage2QList',
  });
  return stage2QList;
};