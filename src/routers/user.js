const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transactions = require("../models/Transactions");
const Wallet = require("../models/Wallet");
const genCert = require("../utils/certGen/certGen");
const { nanoid } = require("nanoid");

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/wallet", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet) {
      return res.status(404).send();
    }
    res.send(wallet);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/generate-cert", async (req, res) => {
  try {
    const { month, year, userId } = req.body;

    const user = User.findById(userId);
    const startOfMonth = new Date(year, month-1, 1);
    const endOfMonth = new Date(year, month-1, 31, 11, 59, 59);
    let a = "";
    const sumTransaction = await Transactions.aggregate([
      { $match: { purchaseDate: { $gte: startOfMonth, $lt: endOfMonth } } },
      { $group: { _id: null, totalSum: { $sum: "$amtToken" } } },
    ]);
    if (month >= 10) {
      a = month.toString();
    } else {
      a = "0" + month.toString();
    }
    const formData = {
      cert_number: (year % 100).toString() + a + nanoid(5),
      name: user.firstname + user.lastname,
      amt_credit: sumTransaction[0].totalSum.toString(),
    };
    const certBuffer = await genCert(formData);
      res.setHeader("Content-Disposition", "inline; filename=filled_invoice.pdf");
      res.setHeader("Content-Type", "application/pdf");
      res.send(certBuffer);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  
  }
});
router.get("/transaction", async (req, res) => {
  try {
    const transaction = await Transactions.findOne({ userId: req.user.userId });
    if (!transaction) {
      return res.status(404).send();
    }
    res.send(transaction);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
