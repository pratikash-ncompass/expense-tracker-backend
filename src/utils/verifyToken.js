const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { executeQuery } = require("./dbConfig");
const { send_response } = require("./response.js");


const _checkUserExistQuery = () => `
    SELECT 
        id 
    FROM 
        users 
    WHERE id = (?);`;

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorizationHeader.slice(7);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const finalQuery = mysql.format(_checkUserExistQuery(), decoded.email);
      const checkUserExist = await executeQuery(finalQuery);

      // console.log((che));
    //   if (checkUserExist[0].isActive === 0) {
    //     return res.status(403).send("Your account has been deleted.");
    //   }
      req.decoded = decoded;

      next();
    } catch (error) {
      console.log(error);
      return send_response(res, 498, false, "Invalid Token", error.message);
    }
  } else {
    return send_response(res, 498, false, "Invalid Token", error);

  }
};
module.exports = { verifyToken };
