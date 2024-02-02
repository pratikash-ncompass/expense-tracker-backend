const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response, error_response } = require("../../utils/response.js");
const mysql = require("mysql2");

const _fetchExpenseByCategory = () => `        
    SELECT 
        c.name, e.amount, e.description, e.details, e.date
    FROM
        categories c
            JOIN
        expenses e ON c.id = e.category_id
    WHERE
        e.user_id = ?;
`;

const getExpenseByCategory = async (req, res) => {
  try {
    const { id } = req.decoded;
    const finalFetchExpenseQuery = mysql.format(_fetchExpenseByCategory(), id);
    const resultArr = await executeQuery(finalFetchExpenseQuery);

    if (resultArr instanceof Error) {
      res.status(400);
      throw new Error(resultArr);
    }

    if (!resultArr.length) {
      res.status(404);
      throw new Error("Not authorized.");
    }

    const resultArrFinal = {};

    resultArr.forEach((transaction) => {
      const key = `${transaction.name}`;
      if (!resultArrFinal[key]) {
        resultArrFinal[key] = {
          resultArr: [],
          totalAmount: 0,
        };
      }
      resultArrFinal[key].resultArr.push(transaction);
      resultArrFinal[key].totalAmount += parseFloat(transaction.amount);
    });

    return send_response(res, 200, true, { expenseData: resultArrFinal });
  } catch (error) {
    console.log(error);
    error_response(res, 500, false, "Something went wrong.", error);
  }
};

module.exports = { getExpenseByCategory };
