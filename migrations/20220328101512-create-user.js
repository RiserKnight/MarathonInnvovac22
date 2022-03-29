'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique:true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true,
        primaryKey:true,
        validate:{
          notNull:{msg:'User  must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }
  
      },
      name: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          notNull:{msg:'User  must have a Name'},
          notEmpty:{msg:'Name must not be empty'}
        }
  
      },
      points:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull:false,
        validate:{
          notNull:{msg:'User  must have points'},
          notEmpty:{msg:'Points must not be empty'}
        }
      },
      currStage:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull:false,
        validate:{
          notNull:{msg:'User  must have Stage'},
          notEmpty:{msg:'Stage must not be empty'}
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
    await queryInterface.dropTable('Users');
  }
};