const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transactions = require("../models/Transactions");
const Wallet = require("../models/Wallet");
const genCert = require("../utils/certGen/certGen");
const { nanoid } = require("nanoid");
const serviceAcc = require("../models/ServiceAcc");

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }).exec();
    if (!user) {
      return res.status(404).send();
    }
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/wallet", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId }).exec();
    if (!wallet) {
      return res.status(404).send();
    }
    res.json({totalPoints: wallet.totalPoints, totalTokens: wallet.totalTokens});
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/transaction", async (req, res) => {
  try {
    const PAGE_SIZE = 10;
    const page = parseInt(req.query.page) || 1;
    const transactionCount = await Transactions.countDocuments({ userId: req.user.userId });
    const totalPages = Math.ceil(transactionCount / PAGE_SIZE);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const skipCount = (page - 1) * PAGE_SIZE;

    const transactions = await Transactions.find({ userId: req.user.userId })
      .skip(skipCount)
      .limit(PAGE_SIZE);

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.json({
      totalTransactions: transactionCount,
      totalPages: totalPages,
      currentPage: page,
      transactions: transactions,
    });
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});



router.post("/generate-cert", async (req, res) => {
  try {
    const tranId = req.body.transactionId;
    
    const tran = await Transactions.findOne({_id:tranId}).exec();
    if(!tran) return res.status(400).json({message: "transaction not found"});
    const userId = tran.userId;

    const user = await User.findById(userId).exec();

    const formData = {
      cert_number: tranId,
      name: user.firstname+' '+user.lastname,
      amt_credit: (tran.amtToken).toString()
    };
    const certBuffer = await genCert(formData);
    res.setHeader("Content-Disposition", "inline; filename=filled_invoice.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(certBuffer);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})


module.exports = router;
