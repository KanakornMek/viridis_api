const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Token = require('../models/Token');
const Transactions = require('../models/Transactions')



router.get('/purchase', async (req, res) => {
    const amtToken = req.body.amountToken
    const tokenPrice = await Token.findOne()
    const totalPrice = amountToken * price
    const userpurchsae = new Transactions
       ( {purchaseDate : Date.now(),
        tokenPrice,
        amtToken,
        totalPrice,
        point : totalPrice,
        paymentId : Date.now()})

    userpurchsae.save();
    res.send(userpurchsae);
    
    
})

router.get('/price', async (req, res) => {
    const token = await Token.findOne();
    console.log(token);
    res.json(token);
})


module.exports = router