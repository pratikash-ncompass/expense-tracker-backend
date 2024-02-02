const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response } = require("../../utils/response.js");

const _getAllUsers = () => `
    SELECT
        username as userName,
        email as emailID
    FROM
        users;
`;

const fetchAllUsers = async (req, res) => {
    const allUsers = await executeQuery(_getAllUsers());

    return send_response(res, 200, allUsers)
};

module.exports = { fetchAllUsers };


// THIS FILE IS USED BY ME TO CHECK IF THE DB CONNECTION AND POSTMANM WORKS FINE