'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stageTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stageTime.init({
    timeID: DataTypes.INTEGER,
    purpose: DataTypes.STRING,
    timeStamp: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'stageTime',
  });
  return stageTime;
};