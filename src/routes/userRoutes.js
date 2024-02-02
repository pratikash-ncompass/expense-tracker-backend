const express = require("express");
const { fetchAllUsers } = require("../controllers/user/fetchAllUsers");
const { registerUser } = require("../controllers/user/registerUserController");
const { loginUser } = require("../controllers/user/loginUserController");
const { verifyToken } = require("../utils/verifyToken");
const { validateUser } = require("../utils/validations");

const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);
router.get("/allUsers", verifyToken, fetchAllUsers);

module.exports = router;
