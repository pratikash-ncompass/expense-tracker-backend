const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response, error_response } = require("../../utils/response.js");
const mysql = require("mysql2");



const _addExpense = () => `
    INSERT INTO 
        expenses (
        user_id ,
        category_id ,
        amount ,
        amount_due ,
        description ,
        details,
        date)
    VALUES 
        (?, ?, ?, ?, ?, ?, curdate());
`;

const addExpense = async (req, res) => {
  try {
    const { id } = req.decoded;
    const expenseData = req.body.expensedata;
    expenseData.details = { ...expenseData.details, last_updated: null };
    const finalInsertquery = mysql.format(_addExpense(), [
      id,
      expenseData.category_id,
      expenseData.amount,
      expenseData.amount,
      expenseData.description,
      JSON.stringify(expenseData.details),
    ]);
    const resultArr = await executeQuery(finalInsertquery);

    send_response(
      res,
      200,
      true,
      `New Expense added successfully for user id ${id}`,
      resultArr
    );
  } catch (error) {
    console.log(error);
    error_response(res, 500, false, "Something went wrong.", error);
  }
};

module.exports = { addExpense };

// -----------------------------------

//----------------------------------------------

// const asyncHandler = require("express-async-handler");
// const { execute } = require("../../utils/dbConnect");
// const { sendResponse } = require("../../utils/sendResponse");

// const insertExpenses = asyncHandler(async (req, res) => {
//   if (resultArr instanceof Error) {
//     res.status(400);
//     throw new Error(resultArr);
//   }
//   return sendResponse(res, true, "Expense data inserted", resultArr, 200);
// });
