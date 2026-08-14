const express =require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../Middleware/authMiddleware')
router.get('/expense',authMiddleware,(req,res)=>{
   const seeData = `SELECT * FROM expenses WHERE user_id = ?`;
   db.query(seeData,[req.user.id],(err,result)=>{
    if(err){
        return res.status(500).json({error:'server error'});
    };
    return res.status(200).json(result);
   });
});
    router.post('/add',authMiddleware,(req,res)=>{
    const {title,amount,catagory,date,description} = req.body;
if(!title || !amount || !catagory || !date){
     return res.status(400).json('Enter the requirements')
}
if (isNaN(amount) || Number(amount)<=0){
    return res.status(400).json('Amount must be positive number.')
}
const sql =` INSERT INTO expenses (user_id,title,amount,catagory,date,description)    
    values(?,?,?,?,?,?)`;                 
    db.query(sql,[req.user.id,title,amount,catagory,date,description],(err,result)=>
        { if (err) {
    console.error("Expense insert error:", err);
    return res.status(500).json({
        error: 'server error'
    });
}
            return res.status(201).json('added');

});
});
router.put('/expense/:id', authMiddleware, (req, res) => {
    const { title, amount, catagory, date, description } = req.body;
    const expenseId = req.params.id;

    if (!title || !amount || !catagory || !date) {
        return res.status(400).json({
            error: 'Enter the required fields'
        });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({
            error: 'Amount must be a positive number'
        });
    }

    const sql = `
        UPDATE expenses
        SET title = ?, amount = ?, catagory = ?, date = ?, description = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [title, amount, catagory, date, description, expenseId, req.user.id],
        (err, result) => {
            if (err) {
                console.error("Expense update error:", err);
                return res.status(500).json({
                    error: 'Server error'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Expense not found'
                });
            }

            return res.status(200).json({
                message: 'Expense updated successfully'
            });
        }
    );
});
router.delete('/expense/:id', authMiddleware, (req, res) => {
    const expenseId = req.params.id;

    const sql = `
        DELETE FROM expenses
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [expenseId, req.user.id], (err, result) => {
        if (err) {
            console.error("Expense delete error:", err);
            return res.status(500).json({
                error: 'Server error'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Expense not found'
            });
        }

        return res.status(200).json({
            message: 'Expense deleted successfully'
        });
    });
});
module.exports =router;