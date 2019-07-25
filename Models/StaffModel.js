const mongoose = require("mongoose");

// before we start schema the first thing to be set staffSchema to be avialbe to specific user.. bcz every staff is not avilable to all user. the application we build have feature that specific user have specific staff ..so we have to relate user to staff Schema..below line of code will does this thing..

const StaffSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("staff", StaffSchema);
