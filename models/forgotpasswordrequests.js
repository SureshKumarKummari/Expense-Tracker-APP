const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const forgotPassword=sequelize.define('forgotpasswordrequests',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    isactive:{
        type:Sequelize.BOOLEAN,
        defaultValue: true,
    },

});

module.exports=forgotPassword;