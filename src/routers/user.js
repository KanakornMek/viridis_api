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
    const tranId = req.body.transactionId;
    
    const tran = await Transactions.findOne({_id:tranId}).exec();
    
    const userId= tran.userId;
 
    const user= await User.findOne({_id:userId}).exec();
    const date =new Date();
    const month= date.getMonth() +1;
    
    const year= date.getFullYear();
    
    let monthString = "";
    
    if (month >= 10) {
      monthString = month.toString();
    } else {
      monthString = "0" + month.toString();
    }
    const formData = {
      cert_number: (year % 100).toString() + monthString + nanoid(5),
      name: user.firstname+' '+user.lastname,
      amt_credit: (tran.amtToken).toString()
    };
    console.log(formData.cert_number);
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
    res.status(500).send(err);
  }
});

module.exports = router;
