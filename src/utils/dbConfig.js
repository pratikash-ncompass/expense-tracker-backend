const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

let connection;

const createConnection = () => {
  connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
};

let connectionPromise;

async function executeQuery(query) {
  try {
    createConnection();
    connectionPromise = connection.promise();
    let y;
    await connectionPromise.query(query).then((response) => {
      y = response[0];
    });
    return y;
  } catch (error) {
    throw error;
  } finally {
    connection.end((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connection Terminated");
      }
    });
  }
}

module.exports = {connectionPromise, executeQuery}