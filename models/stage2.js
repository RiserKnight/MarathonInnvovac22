'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stage2 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stage2.init({
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
    option1:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a option'},
        notEmpty:{msg:'Option must not be empty'}
      }
    },
    option2:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a option'},
        notEmpty:{msg:'Option must not be empty'}
      }
    },
    option3:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a option'},
        notEmpty:{msg:'Option must not be empty'}
      }
    },
    option4:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a option'},
        notEmpty:{msg:'Option must not be empty'}
      }
    }
    ,
    answer:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'Question must have a answer'},
        notEmpty:{msg:'Answer must not be empty'}
      }}
  }, {
    sequelize,
    modelName: 'Stage2',
  });
  return Stage2;
};