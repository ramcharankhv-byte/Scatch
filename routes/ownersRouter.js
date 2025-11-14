const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model.js");
const isLoggedin = require("../middlewares/isLoggedin.js");
const { registeredUser , loginUser } = require("../controllers/authController");
require("dotenv").config();


if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    let owners = await ownerModel.find();
    if (owners.length > 0)
      return res
        .status(503)
        .send("you dont have permission to create a new owner");

    let { fullname, email, password } = req.body;

    let createdOwner = await ownerModel.create({
      fullname,
      email,
      password,
    });
    res.send(createdOwner);
  });
}

router.get("/login", (req, res) => {
  res.render("owner-login");
});
router.post("/login", loginUser)
router.get("/admin", (req, res) => {
  let success=req.flash("success");
  res.render("createproducts",{success});
});

module.exports = router;
