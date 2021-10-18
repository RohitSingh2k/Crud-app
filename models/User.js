const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
    unique:false,
  },
  city: {
    type: String,
    required: true,
    unique:false,
  },
  gender: {
    type: String,
    required: true,
    unique:false,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("User", userSchema);
