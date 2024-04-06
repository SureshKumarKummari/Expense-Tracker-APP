const expenseTable=require('../models/expenses');



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


exports.addExpense = (req, res, next) => {
    const obj = {
        expense: req.body.expense,
        description: req.body.description,
        category: req.body.category,
        userId: req.user.id // Assuming userId is passed in the request body
    };

    expenseTable.create(obj)
        .then(expense => {
            res.status(201).json(expense); // Return the created expense record
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};




exports.deleteExpense=(req,res,next)=>{
    console.log(req.params.id);
    expenseTable.findByPk(req.params.id)
        .then(expense => {
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
        return expens.save();
    }).then((updatedExpense) => {
            res.status(200).json(updatedExpense); // Respond with the updated expense record
    }).catch((error) => {
            console.error('Error updating expense:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
    

}