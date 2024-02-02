const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response } = require("../../utils/response.js");
const { error_response } = require("../../utils/response.js");

const saltRounds = 10;

const _checkUserExists = () => `
    SELECT 
        id, email
    FROM 
        users;`;

const _registerUser = () => `
    INSERT INTO 
        users (id, username, email, password) 
    VALUES (?)
`;

const registerUser = async (req, res) => {
  try {
    const userData = req.body.userdata;
    let insertData = [];
    for (const key in userData) {
      insertData.push(userData[key]);
    }
    const hashedPassword = await bcrypt.hash(insertData[3], saltRounds);
    insertData[3] = hashedPassword;

    const finalInputObj = {
      id: insertData[0],
      username: insertData[1],
      email: insertData[2],
      hashedPassword: insertData[3],
    };

    const userExists = await executeQuery(_checkUserExists());
    if (userExists.id == insertData[0] || userExists.email === insertData[2]) {
      // return res.json({ message: "Can't create New. User already exists." });
      return error_response(res, 400, false, "User already exists");
    }

    const finalinsertQuery = mysql.format(_registerUser(), [insertData]);
    await executeQuery(finalinsertQuery);

    send_response(res, 200, true, "New User added successfully", finalInputObj);
  } catch (error) {
    console.log(error);
    error_response(res, 500, false, "Something went wrong.", error);
  }
};

module.exports = { registerUser };
