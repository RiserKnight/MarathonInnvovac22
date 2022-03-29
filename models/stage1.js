'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stage1 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stage1.init({
    qID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
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
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a answer'},
        notEmpty:{msg:'Answer must not be empty'}
      }
    }

  }, {
    sequelize,
    modelName: 'Stage1',
  });
  return Stage1;
};