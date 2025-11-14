const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const { registeredUser , loginUser } = require("../controllers/authController");

router.post("/register", registeredUser);

router.post("/login", loginUser)


module.exports = router;
