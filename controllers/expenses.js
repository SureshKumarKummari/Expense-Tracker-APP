const expenseTable=require('../models/expenses');
const usersTable=require('../models/users');
const Sequelize=require('sequelize');


exports.getExpenses = (req, res, next) => {
    let id=req.user.id;
    expenseTable.findAll({where:{userId:id}})
        .then(expenses => {
            //console.log(expenses);
            let expen=expenses.map(i=>{
                return i.dataValues});
            res.status(200).json(expen); // Return all expenses as JSON
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


exports.getLeaderbord = async (req, res, next) => {
    try {
        console.log('fromLeaderboard!');
        const usersExpenses = await usersTable.findAll({
            // attributes: ['username',
            // [Sequelize.fn('SUM', Sequelize.col('expense')), 'totalExpense']
            //     ],
            // include:[{model:expenseTable,attributes:[]}],
            // group:['id'],
            // order:[['totalExpense','DESC']]
            attributes:['username','totalexpenses'],
            order:[['totalexpenses','DESC']]
        
        }).then(result=>{
            console.log(result);
            res.status(200).json(result);
        }).catch(err=>{
            throw new Error(err);
        })
    } catch (error) {
        console.error('Error fetching user expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.addExpense = (req, res, next) => {
    const obj = {
        expense: req.body.expense,
        description: req.body.description,
        category: req.body.category,
        userId: req.user.id // Assuming userId is passed in the request body
    };
    changeexpense(obj.userId,obj.expense,'add');
    expenseTable.create(obj)
        .then(expense => {
            res.status(201).json(expense); // Return the created expense record
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

//Modifying totalexpense amount of use
function changeexpense(userid,expense,operation){
    usersTable.findByPk(userid).then(user=>{
        if(operation==='add'){
        user.totalexpenses=user.totalexpenses+expense;
        }else if(operation==='update'){
            user.totalexpenses=expense;
        }else{
            user.totalexpenses=user.totalexpenses-expense;
        }
        user.save();
    }).catch(err=>{
        console.log(err);
    })
}

exports.deleteExpense=(req,res,next)=>{
    console.log(req.params.id);
    expenseTable.findByPk(req.params.id)
        .then(expense => {
            changeexpense(expense.userId,expense.expense,'delete');
            return expense.destroy();
        }).then(response=>{
            res.status(200).send(response);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}



exports.updateExpense=(req,res,next)=>{
    let id=req.params.id;
    expenseTable.findByPk(id)
    .then((expens)=>{
        expens.expense=req.body.expense;
        expens.category=req.body.category;
        expens.description=req.body.description;
        changeexpense(expens.userId,expens.expense,'update');
        return expens.save();
    }).then((updatedExpense) => {
            res.status(200).json(updatedExpense); // Respond with the updated expense record
    }).catch((error) => {
            console.error('Error updating expense:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
    

}