const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response } = require("../../utils/response.js");

const _getAllExpenses = () => `
    SELECT
        user_id as userID,
        category_id as categoryID,
        amount,
        amount_due as amountDue,
        description,
        details,
        date
    FROM
        expenses;
`;

const fetchAllExpenses = async (req, res) => {
    const allExpenses = await executeQuery(_getAllExpenses());

    return send_response(res, 200, allExpenses)
};

module.exports = { fetchAllExpenses };


