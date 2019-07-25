const mongoose = require("mongoose");

const SupplierSchema = mongoose.Schema({
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
  email: {
    type: String
  },
  phone: {
    type: String
  },
  adress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("supplier", SupplierSchema);
