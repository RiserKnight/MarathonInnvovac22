'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('usersStage2s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
        }},
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('usersStage2s');
  }
};