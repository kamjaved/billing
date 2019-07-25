const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Customer = require("../Models/ContactModel");

// @route   GET api/contact
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

// @route   Post api/contacts/:id
// @desc    add new contact
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
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, contact_person } = req.body;
    try {
      const newCustomer = new Customer({
        name,
        email,
        phone,
        contact_person,
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

// @route   Put api/contacts/:id
// @desc    Update contact
// @access  Private
// router.put("/:id", authmw, async (req, res) => {
//   const { name, email, phone, type } = req.body;

//   // Build Contact Object
//   const contactFields = {};
//   if (name) contactFields.name = name;
//   if (email) contactFields.email = email;
//   if (phone) contactFields.phone = phone;
//   if (type) contactFields.type = type;

//   try {
//     let contact = await Contact.findById(req.params.id);
//     if (!contact) return res.status(404).json({ msg: "Contact Not Found" });

//     // Making sure user owns contact & user doesnt updtae another user contact
//     if (contact.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "Not Authorized" });
//     }

//     contact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       { $set: contactFields },
//       { new: true }
//     );
//     res.json(contact);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route   Delete api/contacts/:id
// @desc    Delete Contact
// @access  Private

// router.delete("/:id", authmw, async (req, res) => {
//   try {
//     let contact = await Contact.findById(req.params.id);
//     if (!contact) return res.status(404).json({ msg: "Contact Not Found" });

//     // Making sure user owns contact & user doesnt updtae another user contact
//     if (contact.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "Not Authorized" });
//     }

//     await Contact.findOneAndRemove(req.params.id);

//     res.json({ msg: "Contact Deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
