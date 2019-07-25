const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../Models/UserModel");

//@route   POST api/users
//@desc    Register a User
//@acess   Public
router.post(
  // Check User enter valid email name or password or not
  "/",
  [
    check("name", "Please Add Name")
      .not()
      .isEmpty(),
    check("email", "Please Enter a Valid Email").isEmail(),
    check("password", "Password must be 6 or More Characters").isLength({
      min: 6
    })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Lower One Check already Registerd user,
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email: email }); // checking in DB .. if same email found its gives error.

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      // if user doesn't exist we treat as a new user and create a new one
      user = new User({
        name,
        email,
        password
      });

      // --now before sending to DB we Want to encrypt password for security and genrate a token based on user password.--

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // genrating a token
      const payload = {
        user: {
          id: user.id
        }
      }; // for genrating a token jwt require sign method where 2 param is fulfilled 1st payload 2nd secret which is define in defult.json
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000 // 3600 ms 1hr aftr a hour token expire...
        },
        (err, token) => {
          if (err) throw err; // if err throw err if not genrate token
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
