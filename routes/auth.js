const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");

//@route GET api/auth
//@desc GET Logged In User
//@acess Private
router.get("/", authmw, async (req, res) => {
  try {
    // after passing auth we getting user from DB through its ID. but we dont want to return password request. so we exclude password....
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/auth
//@desc Auth user & get Token
//@acess Public
router.post(
  "/",
  [
    // --Checking User have correct email and password or not
    check("email", "Please enter valid email").isEmail(),
    check("password", "Password is Required").exists()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // finding email and check from db is valid or not

      let user = await User.findOne({ email });
      if (!user) {
        //--if email is not valid then err msg
        return res.status(400).json({ msg: "Invalid Email" });
      } // if email is valid and password is invalid then again err msg
      const isMtach = await bcrypt.compare(password, user.password);
      if (!isMtach) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
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
