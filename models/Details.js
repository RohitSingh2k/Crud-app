const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailsSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique : false,
  },
  date: {
    type: String,
    required: true,
    unique : false,
  },
  offer: {
    type: String,
    required: true,
    unique : false,
  },
  clicks: {
    type: Number,
    required: true,
    unique : false,
  },
  unique_clicks: {
    type: Number,
    required: true,
    unique : false,
  },
  conversions: {
    type: Number,
    required: true,
    unique : false,
  },
  epc: {
    type: Number,
    required: true,
    unique : false,
  },
  unique_epc: {
    type: Number,
    required: true,
    unique : false,
  },
  revenue: {
      type : Number,
      required : true,
      unique : false,
  }
});

module.exports = mongoose.model("Details", detailsSchema);
