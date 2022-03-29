'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        unique:true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      ,
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
    await queryInterface.dropTable('Groups');
  }
};