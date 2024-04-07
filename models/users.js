const { uniqueID } = require('mocha/lib/utils');
const sequelize=require('../util/database');

const Sequelize=require('sequelize');


const Users=sequelize.define('users',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,  
        primaryKey:true
    },
    username:{
        type: Sequelize.STRING,
        alloNull: false
    },
    email:{
        type: Sequelize.STRING,
        alloNull: false,
        primaryKey: true
    },
    password:{
        type: Sequelize.STRING,
        alloNull: false,
    },
    ispremiumuser:Sequelize.BOOLEAN
});

module.exports=Users;