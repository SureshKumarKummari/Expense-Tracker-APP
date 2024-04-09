//Database
const sequelize=require('./util/database');
const expenses=require('./models/expenses');
const users=require('./models/users');
const orders=require('./models/orders');
const forgotpassword=require('./models/forgotpasswordrequests');
const fileurls=require('./models/fileurls');

//Middlewares
const helmet=require('helmet');
const morgan=require('morgan');

//base modules
const fs=require('fs');

require('dotenv').config();

//Routers
const admin=require('./routes/admin');
const handleexpenses=require('./routes/expenses');
const purchase=require('./routes/purchase');

//importing path 
const path = require('path');

const express = require('express');

const cors=require('cors');

const bodyParser = require('body-parser');

const app = express();

//Adding ejs middleware and seting dirname views
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(helmet());

const accessLogstream=fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
);
app.use(morgan('combined',{stream:accessLogstream}))


app.use(cors());

app.use(bodyParser.json());

app.use(admin);

app.use(handleexpenses);

app.use(purchase);

users.hasMany(expenses);
expenses.belongsTo(users);

users.hasMany(orders);
orders.belongsTo(users);

users.hasMany(forgotpassword);
forgotpassword.belongsTo(users);

users.hasMany(fileurls);
fileurls.belongsTo(users);

const port=process.env.PORT || 3000;
sequelize.sync().then(()=>{
app.listen(port,()=>{
    console.log(`App listening on PORT ${port}!`)
})
}).catch(err=>console.log(err));

