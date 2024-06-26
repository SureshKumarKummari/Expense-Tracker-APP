const expenseTable=require('../models/expenses');
const usersTable=require('../models/users');
const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const fileurls=require('../models/fileurls');

//getting uploadaws
const uploadtoaws=require('../util/uploadingtoaws');


exports.getExpenses = async(req, res, next) => {
    let id=req.user.id;
    if(req.params.pagenumber){
        const page = req.params.pagenumber || 1;
        const limit = Number(req.params.itemsperpage);
        console.log(page,limit);
        const offset = (page - 1) * limit;
        try {
            const expenses = await expenseTable.findAll({
                offset,
                limit,
                order: [['createdAt', 'DESC']]
            });
            let count=await expenseTable.count();
            let totalpages=Math.ceil(count/limit);
            expense=[...expenses,{lastpagenumber:totalpages}];
            res.status(200).json(expense);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }else{
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
    }
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
            attributes:['username','totalexpenses','id'],
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



exports.addExpense = async (req, res, next) => {
    const obj = {
        expense: req.body.expense,
        description: req.body.description,
        category: req.body.category,
        userId: req.user.id // Assuming userId is passed in the request body
    };

    try {
        const t = await sequelize.transaction();
        const expense = await expenseTable.create(obj, { transaction: t });
        await changeexpense(obj.userId, obj.expense, 'add');
        await t.commit();
        res.status(201).json(expense); // Return the created expense record
    } catch (error) {
        console.error('Error adding expense:', error);
        await t.rollback();
        res.status(500).json({ error: 'Internal server error' });
    }
};

function changeexpense(userid, expense, operation) {
    return new Promise((resolve, reject) => {
        usersTable.findByPk(userid)
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                if (operation === 'add') {
                    user.totalexpenses += Number(expense);
                } else if (operation === 'update') {
                    user.totalexpenses = Number(expense);
                } else if (operation === 'delete') {
                    user.totalexpenses -= Number(expense);
                } else {
                    throw new Error('Invalid operation');
                }
                console.log(user);
                return user.save();
            })
            .then(updatedUser => {
                resolve(updatedUser);
            })
            .catch(err => {
                console.error('Error in changeexpense:', err);
                reject(err);
            });
    });
}



exports.deleteExpense = async (req, res, next) => {
    try {
        const id = req.params.id;
        const expenseToDelete = await expenseTable.findByPk(id);
        if (!expenseToDelete) {
            throw new Error('Expense not found');
        }

        const userId = expenseToDelete.userId;
        const expenseAmount = expenseToDelete.expense;
        const t = await sequelize.transaction();

        await changeexpense(userId, expenseAmount, 'delete', t);
        await expenseToDelete.destroy({ transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        if (t) await t.rollback();
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




exports.updateExpense = async (req, res, next) => {
    try {
        let id = req.params.id;
        const t = await sequelize.transaction();
        const expenseToUpdate = await expenseTable.findByPk(id, { transaction: t });
        if (!expenseToUpdate) {
            throw new Error('Expense not found');
        }
        expenseToUpdate.expense = req.body.expense;
        expenseToUpdate.category = req.body.category;
        expenseToUpdate.description = req.body.description;

        await changeexpense(expenseToUpdate.userId, expenseToUpdate.expense, 'update', t);
        const updatedExpense = await expenseToUpdate.save({ transaction: t });
        await t.commit();
        res.status(200).json(updatedExpense); // Respond with the updated expense record
    } catch (error) {
        if (t) await t.rollback();
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




exports.download = async (req, res, next) => {
    try {
        // Retrieve expenses for the user
        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);

        // Upload expenses to S3
        const filename ="Expensesreport"+getdate()+".txt";
        const fileUrl = await uploadtoaws.uploadtoS3(stringifiedExpenses, filename);

        // Save file URL to database
        await fileurls.create({
            link: fileUrl,
            userId: req.user.id,
        });

        // Retrieve all file URLs for the user
        const allUrls = await fileurls.findAll({
            attributes: ['link', 'createdAt'],
            where: { userId: req.user.id },
            raw: true // Add this option to return raw data objects
        });
        console.log(allUrls);
        // Send response with list of file URLs
        res.status(200).json( allUrls );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};



function getdate(){
    const currentDate = new Date();

        // Get individual date components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
        return formattedDate; // Output: "2024-04-05-10-30-15" (for example)
}
