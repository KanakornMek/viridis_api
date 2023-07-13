const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Praram get token info");
})

router.get('/wallet', (req,res) => {
    res.send("Wallet");
})
// .
// .
// .

module.exports = router