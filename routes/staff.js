const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
// kisi no se call
const User = require("../Models/UserModel");
const Staff = require("../Models/StaffModel");

//@route  GET api/staff
//@desc  Show User Saved Staff
//@acess Private
router.get("/", authmw, async (req, res) => {
  try {
    const staffs = await Staff.find({ user: req.user.id }).sort({ date: -1 });
    res.json(staffs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/add-staff
// @desc     Add a Staff
// @acess    Private
router.post(
  "/",
  [
    authmw,
    [
      check("first_name", "First-Name is Required")
        .not()
        .isEmpty(),
      check("last_name", "Last-Name is Required")
        .not()
        .isEmpty(),
      check("user_name", "UserName is Required")
        .not()
        .isEmpty(),
      check("password", "Password is Required")
        .not()
        .isEmpty(),
      check("email", "Email is Required")
        .not()
        .isEmpty(),
      check("phone", "Phone is Required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //----pulling Data From Body--------
    const {
      first_name,
      last_name,
      user_name,
      password,
      phone,
      email
    } = req.body;

    try {
      const newStaff = new Staff({
        first_name,
        last_name,
        user_name,
        password,
        phone,
        email,
        user: req.user.id
      });
      const staff = await newStaff.save();
      res.json(staff);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   PUT api/staff/:id
//@desc    Update User Saved Staff
//@acess   Private

router.put("/:id", authmw, async (req, res) => {
  const { first_name, last_name, user_name, password, phone, email } = req.body;

  // Build Staffs Object
  const staffFields = {};
  if (first_name) staffFields.first_name = first_name;
  if (last_name) staffFields.last_name = last_name;
  if (user_name) staffFields.user_name = user_name;
  if (password) staffFields.password = password;
  if (email) staffFields.email = email;
  if (phone) staffFields.phone = phone;

  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ msg: "Staff Not Found" });

    // Making sure user owns staffs & user doesnt updtae another user staffs
    if (staff.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true }
    );
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route   DELETE api/staff/:id
//@desc    Delete Saved Staff
//@acess   Private
router.delete("/:id", authmw, async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ msg: "Staff Not Found" });

    // Making sure user owns staff & user doesnt updtae another user Staff
    if (staff.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Staff.findOneAndRemove(req.params.id);

    res.json({ msg: "Staff Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
