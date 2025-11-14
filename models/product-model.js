const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
  name: String,
  discount: {
    type:Number,
    default:0
  },
  price: Number,
  image: Buffer,
  bgcolor: String,
  panelcolor: String,
  textcolor: String

})
 
module.exports = mongoose.model("product",productSchema);