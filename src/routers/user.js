const User = require("../models/User");
const Transactions = require("../models/Transactions");
const Wallet = require("../models/Wallet");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send(req.user.userId));

router.get("/user", async (req, res) => {
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
