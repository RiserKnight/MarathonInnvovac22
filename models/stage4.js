'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stage4 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stage4.init({
    qID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }

    },
    question:{
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a question'},
        notEmpty:{msg:'Question must not be empty'}
      }
    },
    answer:{
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a answer'},
        notEmpty:{msg:'Answer must not be empty'}
      }
    }
  }, {
    sequelize,
    modelName: 'Stage4',
  });
  return Stage4;
};