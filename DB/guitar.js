const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guitarSchema = new Schema({
  guitar_name: {
    type: String,
    require: false
  },
  name_identifier: {
    type: String,
    require: false
  },
  sale_price: {
    type: String,
    require: false
  },
  original_price: {
    type: String,
    require: false
  },
  price_difference: {
    type: String,
    require: false
  }
});

// create model
const Guitar = mongoose.model("guitar", guitarSchema);

// export the model
module.exports = Guitar;