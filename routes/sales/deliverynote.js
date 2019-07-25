const express = require("express");
const router = express.Router();
const authmw = require("../../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const Delivery = require("../../Models/sales/DeliveryModel");

// @route   GET api/Delivery
// @desc    view Added Delivery
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const deliverynote = await Delivery.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(deliverynote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Delivery/
// @desc    add newDelivery
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("po_no", "Purchase Order No is Required")
        .not()
        .isEmpty(),

      check("dn_no", "Delivery Note No. is Required")
        .not()
        .isEmpty(),

      check("customer", "Customer name is Required")
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
      dn_no,
      po_no,
      customer,
      dn_date,
      dispatch_through,
      destination,
      payment_term
    } = req.body;
    try {
      const newDelivery = new Delivery({
        dn_no,
        po_no,
        customer,
        dn_date,
        dispatch_through,
        destination,
        payment_term,
        user: req.user.id
      });
      const delivery = await newDelivery.save();
      res.json(delivery);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Delivery/:id
// @desc    UpdateDelivery
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const {
    dn_no,
    po_no,
    customer,
    dn_date,
    dispatch_through,
    destination,
    payment_term
  } = req.body;

  // Build Delivery Object
  const DeliveryFields = {};
  if (dn_no) DeliveryFields.dn_no = dn_no;
  if (po_no) DeliveryFields.po_no = po_no;
  if (customer) DeliveryFields.customer = customer;
  if (dn_date) DeliveryFields.dn_date = dn_date;
  if (dispatch_through) DeliveryFields.dispatch_through = dispatch_through;
  if (destination) DeliveryFields.destination = destination;
  if (payment_term) DeliveryFields.payment_term = payment_term;

  try {
    let delivery = await Delivery.findById(req.params.id);
    if (!delivery)
      return res.status(404).json({ msg: "Delivery Note Not Found" });

    // Making sure user owns contact & user doesnt updtae another user contact
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { $set: DeliveryFields },
      { new: true }
    );
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/Delivery/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let delivery = await Delivery.findById(req.params.id);
    if (!delivery)
      return res.status(404).json({ msg: "Delivery Note Not Found" });

    // Making sure user owns contact & user doesnt delete another user Delivery
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Delivery.findOneAndRemove(req.params.id);

    res.json({ msg: "Delivery Note Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
