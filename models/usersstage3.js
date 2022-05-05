'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersStage3 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usersStage3.init({
    userID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }

    },
    questionNo: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:'Submission  must have a question no'},
        notEmpty:{msg:'question np must not be empty'}
      }},
      submission: DataTypes.STRING 
  }, {
    sequelize,
    modelName: 'usersStage3',
  });
  return usersStage3;
};