const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const order=sequelize.define('orders',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
});

module.exports=order;