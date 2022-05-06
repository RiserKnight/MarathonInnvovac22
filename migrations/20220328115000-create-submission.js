'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Submissions', {
      id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique:true,
        primaryKey: true,
        
      },
      qID: {
          type:DataTypes.INTEGER,
          allowNull:false,
          primaryKey:true,
          validate:{
            notNull:{msg:'User  must have a id'},
            notEmpty:{msg:'id must not be empty'}
          }
        },
        
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
    
      },
        timeStamp:{
          type:DataTypes.STRING,
          allowNull:false,
          validate:{
            notNull:{msg:'Submission must have a timestamp'},
            notEmpty:{msg:'TimeStamp must not be empty'}
          }
        },
       fPoint: {
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
          notNull:{msg:'Submission must have a full point'},
          notEmpty:{msg:'FullPoint must not be empty'}
        }
      },
      userans:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          notNull:{msg:'Submission must have a value'},
          notEmpty:{msg:'Submission value must not be empty'}
        }},
      stage:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
          notNull:{msg:'Submission must have a stage'},
          notEmpty:{msg:'Stage must not be empty'}
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
    await queryInterface.dropTable('Submissions');
  }
};