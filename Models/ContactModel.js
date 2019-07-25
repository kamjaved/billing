const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },

  contact_person: {
    type: String,
    required: true
  },
  customer_code: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("customer", CustomerSchema);
