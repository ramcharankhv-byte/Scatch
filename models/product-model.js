const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
  name: String,
  discount: {
    type:Number,
    default:0
  },
  price: Number,
  image: String,
  bgcolor: String,
  panelcolor: String,
  textcolor: String

})
 
module.export= mongoose.model("product",productSchema);