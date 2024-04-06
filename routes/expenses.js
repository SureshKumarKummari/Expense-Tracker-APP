const express=require('express');
const expense=require('../controllers/expenses');

const userauth=require('../middleware/userauthentication');

const router=express.Router();

router.get('/getExpenses',userauth.authenticate,expense.getExpenses);

router.post('/addExpense',userauth.authenticate,expense.addExpense);

router.delete('/deleteExpense/:id',userauth.authenticate,expense.deleteExpense);

router.put('/updateExpense/:id',userauth.authenticate,expense.updateExpense);

module.exports=router;

