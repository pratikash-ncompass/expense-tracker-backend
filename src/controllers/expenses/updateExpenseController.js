const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response, error_response } = require("../../utils/response.js");
const mysql = require("mysql2");

const _updateExpense = () => `
    UPDATE expenses 
    SET 
        amount_due = ?,
        details = JSON_SET(details, '$.last_updated', CURDATE()) 
    WHERE id = ? and user_id = ?;
`;

const _fetchAmountDue = () => `
    SELECT 
      amount_due 
    FROM 
      expenses 
    WHERE 
      id = ? and user_id = ?
`;

const updateExpense = async (req, res) => {
  try {
    const { id } = req.decoded;
    const updateData = req.body.updateexpensedata;

    const fetchAmountDueQueryData = [updateData.expense_id, id];

    const finalFetchAmountDueQuery = mysql.format(
      _fetchAmountDue(),
      fetchAmountDueQueryData
    );
    const resultArrFetchAmountDue = await executeQuery(
      finalFetchAmountDueQuery
    );

    if (!resultArrFetchAmountDue.length) {
      res.status(404);
      throw new Error("Not authorized or invalid expense id.");
    }

    if (resultArrFetchAmountDue instanceof Error) {
      res.status(400);
      throw new Error(resultArrFetchAmountDue);
    }

    let amountRemaining =
      resultArrFetchAmountDue[0].amount_due - updateData.amount_paid;
    let amountDue = amountRemaining > 0 ? amountRemaining : 0;

    const updateExpenseQueryData = [amountDue, updateData.expense_id, id];

    const finalUpdateExpenseQuery = mysql.format(
      _updateExpense(),
      updateExpenseQueryData
    );
    const resultArrUpdateExpense = await executeQuery(finalUpdateExpenseQuery);

    if (resultArrUpdateExpense instanceof Error) {
      res.status(400);
      throw new Error(resultArrUpdateExpense);
    }

    return send_response(res, 200, true, { updateData });
  } catch (error) {
    console.log(error);
    error_response(res, 500, false, "Something went wrong.", error);
  }
};

module.exports = { updateExpense };
