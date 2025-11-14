process.noDeprecation = true;
require('dotenv').config();
const express = require("express");
const app= express();
const cookieParser = require("cookie-parser");
const path= require('path');
const db = require("./config/mongoose-connection");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const expressSession = require("express-session");
const flash = require("connect-flash")

const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_ENV_SECRET
  })
);
app.use(flash());
app.use("/",indexRouter);
app.use("/owner",ownersRouter);
app.use("/user", usersRouter);
app.use("/product",productsRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});