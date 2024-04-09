require('dotenv').config();

const Sequelize=require('sequelize');

const db=new Sequelize(process.env.DB_DATABASE,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
});

module.exports=db;