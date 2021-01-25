const { BSONType } = require("mongodb");
const mongoose = require("mongoose");
require('mongoose-type-url');
const Schema = mongoose.Schema;

const guitarSchema = new Schema({
  count: {
    type: Number,
    require: true
  },
  guitar_name: {
    type: String,
    require: false
  },
  name_identifier: {
    type: String,
    require: false
  },
  link: {
    type: String,
    require: false
  },
  beef: {
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
  ,
  guitar_image: {
    type: String,
    require: false
  }
});

// create model
const Guitar = mongoose.model("guitar", guitarSchema);

// export the model
module.exports = Guitar;