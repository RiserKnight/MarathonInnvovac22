'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('usersStage3s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
        submission: DataTypes.STRING,
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
    await queryInterface.dropTable('usersStage3s');
  }
};