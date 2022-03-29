'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Stage2s', {
      id: {
        allowNull: false,
        unique:true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
    await queryInterface.dropTable('Stage2s');
  }
};