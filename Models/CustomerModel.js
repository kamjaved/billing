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
  cr_no: {
    type: String
  },

  contact_person: {
    type: String,
    required: true
  },
  customer_code: {
    type: String,
    required: true
  },
  email: {
    type: String
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
