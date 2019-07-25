const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Customer = require("../Models/ContactModel");

// @route   GET api/customer
// @desc    Get Logged in user
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const customer = await Customer.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/customers/:id
// @desc    add new customer
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("name", "Name is Required")
        .not()
        .isEmpty(),

      check("contact_person", "Person Name is Required")
        .not()
        .isEmpty(),

      check("customer_code", "Customer Code is Required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      phone,
      cr_no,
      contact_person,
      customer_code
    } = req.body;
    try {
      const newCustomer = new Customer({
        name,
        email,
        phone,
        cr_no,
        contact_person,
        customer_code,
        user: req.user.id
      });
      const customer = await newCustomer.save();
      res.json(customer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/customers/:id
// @desc    Update customer
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const { name, email, phone, cr_no, contact_person, customer_code } = req.body;

  // Build Contact Object
  const customerFields = {};
  if (name) customerFields.name = name;
  if (email) customerFields.email = email;
  if (phone) customerFields.phone = phone;
  if (cr_no) customerFields.cr_no = cr_no;

  if (contact_person) customerFields.contact_person = contact_person;
  if (customer_code) customerFields.customer_code = customer_code;

  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ msg: "Customer Not Found" });

    // Making sure user owns customer & user doesnt updtae another user customer
    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: customerFields },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/customers/:id
// @desc    Delete Contact
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ msg: "Customer Not Found" });

    // Making sure user owns customer & user doesnt updtae another user customer
    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Customer.findOneAndRemove(req.params.id);

    res.json({ msg: "Customer Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
