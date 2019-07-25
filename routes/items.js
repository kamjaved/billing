const express = require("express");
const router = express.Router();
const authmw = require("../middleware/authmw");
const { check, validationResult } = require("express-validator/check");
const User = require("../Models/UserModel");
const Item = require("../Models/ItemModel");

// @route   GET api/item
// @desc    view Added Item
// @access  Private
router.get("/", authmw, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/Item/
// @desc    add newItem
// @access  Private

router.post(
  "/",
  [
    authmw,
    [
      check("desc", "Description is Required")
        .not()
        .isEmpty(),

      check("supplier", "Suppliers is Required")
        .not()
        .isEmpty(),

      check("purchase_price", "Purchase Price is Required")
        .not()
        .isEmpty(),

      check("sell_price", "Sell Price is Required")
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
      desc,
      item_no,
      code_partno,
      supplier,
      purchase_price,
      sell_price
    } = req.body;
    try {
      const newItem = new Item({
        desc,
        item_no,
        code_partno,
        supplier,
        purchase_price,
        sell_price,
        user: req.user.id
      });
      const item = await newItem.save();
      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/Item/:id
// @desc    UpdateItem
// @access  Private

router.put("/:id", authmw, async (req, res) => {
  const {
    desc,
    item_no,
    code_partno,
    supplier,
    purchase_price,
    sell_price
  } = req.body;

  // Build Item Object
  const itemFields = {};
  if (desc) itemFields.desc = desc;
  if (item_no) itemFields.item_no = item_no;
  if (code_partno) itemFields.code_partno = code_partno;
  if (supplier) itemFields.supplier = supplier;
  if (purchase_price) itemFields.purchase_price = purchase_price;
  if (sell_price) itemFields.sell_price = sell_price;

  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item Not Found" });

    // Making sure user owns Items & user doesnt updtae another user Items
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: itemFields },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/item/:id
// @desc    Delete Suppler
// @access  Private

router.delete("/:id", authmw, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item Not Found" });

    // Making sure user owns item & user doesnt delete another user item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await Item.findOneAndRemove(req.params.id);

    res.json({ msg: "Item Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
