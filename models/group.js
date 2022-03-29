'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    groupID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:'Group must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }},
  userID: {
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
      model:'Users',
      key:'userID'
     },
    validate:{
      notNull:{msg:'User must have a id'},
      notEmpty:{msg:'id must not be empty'}
    }
  }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};