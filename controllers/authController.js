const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");

module.exports.registeredUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    let check = await userModel.findOne({ email });
    if (check) {
      res.render("index" ,({error:"user already registered"}));
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          let createdUser = await userModel.create({
            fullname,
            email,
            password: hash,
          });
          let token = generateToken(createdUser);
          res.cookie("token", token);
          res.send(createdUser);
        });
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Bcrypt error:", err);
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }

      if (!result) {
        req.flash("error", "Wrong password.");
        return res.redirect("/");
      }

      // Success
      const  token = generateToken(user);
      res.cookie("token", token);

      req.session.user = {
        id: user._id,
        fullname: user.fullname,
        email: user.email
      };

      return res.redirect("/shop");
    });
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Something went wrong.");
    return res.redirect("/");
  }
};
