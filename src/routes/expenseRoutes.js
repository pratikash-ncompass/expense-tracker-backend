const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const { fetchAllExpenses } = require("../controllers/expenses/getAllExpenseController");
const { addExpense } = require("../controllers/expenses/addExpenseController");
const { updateExpense } = require("../controllers/expenses/updateExpenseController");
const { getExpenseByCategory } = require("../controllers/expenses/getExpenseByCategoryController");
const { validateInsertExpense, validateUpdateExpense } = require("../utils/validations");
const { getExpenseRecord } = require("../controllers/expenses/getExpenseRecord");

const router = express.Router();

router.post("/addExpense", validateInsertExpense, verifyToken, addExpense);
router.get('/allExpenses', verifyToken, fetchAllExpenses)
router.post('/updateExpense',validateUpdateExpense, verifyToken, updateExpense)
router.get('/getByCategory', verifyToken, getExpenseByCategory)
router.get('/pdf', verifyToken, getExpenseRecord);
module.exports = router;
