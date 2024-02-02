const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response } = require("../../utils/response.js");
const { error_response } = require("../../utils/response.js");

const _checkUserExists = () => `
    SELECT 
        id, email, password
    FROM 
        users
    WHERE
        id = (?);`;

const loginUser = async (req, res) => {
  try {
    const { id, email, password } = req.body.logindata;

    const finalCheckQuery = mysql.format(_checkUserExists(), id);

    const isUserExists = await executeQuery(finalCheckQuery);
    if (!isUserExists) {
      // return res.status(401).json({ error: 'Invalid username or password' });
      return error_response(res, 401, false, "User does  not exist.");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      isUserExists[0].password
    );
 
    if (!passwordMatch) {
      return error_response(res, 401, false, "Invalid credentials!", error);
    }

    const token = jwt.sign({ email, id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    return send_response(res, 200, true, "Token generated", token);
  } catch (error) {
    console.log(error);
    error_response(res, 500, false, "Something went wrong.", error);
  }
};

module.exports = { loginUser };
