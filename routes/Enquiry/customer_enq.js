const express = require("express");
const router = express.Router();
const authmw = require("../../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../../Models/UserModel");
const Customer_enq = require("../../Models/Enquiry/CustomerEnqModel");

// @route   GET api/customer_enq
// @desc    view Added Customer_enq
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const customer_enqs = await Customer_enq.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(customer_enqs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Customer_enq/
// @desc    add newCustomer_enq
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("customer", "Customer is Required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { enq_no, customer } = req.body;
    try {
      const newCustomer_enq = new Customer_enq({
        enq_no,
        customer,
        user: req.user.id
      });
      const customer_enq = await newCustomer_enq.save();
      res.json(customer_enq);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Customer_enq/:id
// @desc    UpdateCustomer_enq
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const { enq_no, customer } = req.body;

  // Build Customer_enq Object
  const customer_enqFields = {};
  if (enq_no) customer_enqFields.enq_no = enq_no;
  if (customer) customer_enqFields.customer = customer;

  try {
    let customer_enq = await Customer_enq.findById(req.params.id);
    if (!customer_enq)
      return res.status(404).json({ msg: "Customer_enq Not Found" });

    // Making sure user owns Customer_enqs & user doesnt updtae another user Customer_enqs
    if (customer_enq.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    customer_enq = await Customer_enq.findByIdAndUpdate(
      req.params.id,
      { $set: customer_enqFields },
      { new: true }
    );
    res.json(customer_enq);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/customer_enq/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let customer_enq = await Customer_enq.findById(req.params.id);
    if (!customer_enq)
      return res.status(404).json({ msg: "Customer_enq Not Found" });

    // Making sure user owns customer_enq & user doesnt delete another user customer_enq
    if (customer_enq.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Customer_enq.findOneAndRemove(req.params.id);

    res.json({ msg: "Customer_enq Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
