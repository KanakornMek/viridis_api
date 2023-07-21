const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Token = require('../models/Token');
const Transactions = require('../models/Transactions')

router.get('/', (req, res) => {
    res.send(req.user.userId)
})

router.get('/purchase', async (req, res) => {
    if(!req.body.amtToken) return res.status(400).send()
    const amtToken = parseInt(req.body.amtToken)
    const tokenPrice = await Token.findOne()
    const totalPrice = amtToken * tokenPrice.price
    const userpurchsae = new Transactions
       ( {purchaseDate : Date.now(),
        tokenPrice,
        amtToken,
        totalPrice,
        point : totalPrice,
        userId: req.user.userId,
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