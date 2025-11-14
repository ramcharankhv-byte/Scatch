const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

// HOME ROUTE
router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

// SHOP PAGE
router.get("/shop", isLoggedin, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

// CART PAGE
router.get("/cart", isLoggedin, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart.product");

  let sum = 0;

  user.cart.forEach((item) => {
    if (item.product) {
      sum += (item.product.price - item.product.discount) * item.quantity;
    }
  });

  res.render("cart", { user, sum });
});

// ADD TO CART
router.get("/addtocart/:id", isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let product = await productModel.findById(req.params.id);

    let itemIndex = user.cart.findIndex((item) =>
      item.product?.equals(product._id)
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ product: product._id, quantity: 1 });
    }

    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
});

// REMOVE FROM CART
router.get("/removefromcart/:id", isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    let itemIndex = user.cart.findIndex((item) =>
      item.product?.equals(req.params.id)
    );

    if (itemIndex > -1) {
      user.cart.splice(itemIndex, 1);
    }

    await user.save();
    req.flash("success", "Removed from cart");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
});
// INCREASE QUANTITY
router.get("/increase/:id", isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    let itemIndex = user.cart.findIndex(item =>
      item.product?.equals(req.params.id)
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
      await user.save();
    }

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.send("Error while increasing quantity");
  }
});

// DECREASE QUANTITY
router.get("/decrease/:id", isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    let itemIndex = user.cart.findIndex(item =>
      item.product?.equals(req.params.id)
    );

    if (itemIndex > -1) {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        // if quantity becomes 0 -> remove item
        user.cart.splice(itemIndex, 1);
      }

      await user.save();
    }

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.send("Error while decreasing quantity");
  }
});

// LOGOUT
router.get("/logout", isLoggedin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

module.exports = router;
