'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('stage2QLists', {
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
      list: {type:DataTypes.TEXT,
        allowNull:false,
        validate:{
          notNull:{msg:'User must have a list'},
          notEmpty:{msg:'List must not be empty'}
        }
      },
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
    await queryInterface.dropTable('stage2QLists');
  }
};