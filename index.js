require("./db/mongoose");
const { profile, transaction, wallet } = require("./userModel");
const express = require("express");
const app = express();

app.get("/user/profile/:id", (req, res) => {
  profile
    .findOne({ ID: req.params.id })
    .then((Profile) => {
      if (!Profile) {
        return res.status(404).send();
      }
      res.send(Profile);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/user/wallet/:id", (req, res) => {
  wallet
    .findById(req.params.id)
    .then((Wallet) => {
      if (!Wallet) {
        return res.status(404).send();
      }
      res.send(Wallet);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/user/transaction/:id", (req, res) => {
  transaction
    .findById(req.params.id)
    .then((Transaction) => {
      if (!Transaction) {
        return res.status(404).send();
      }
      res.send(Transaction);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.listen(3000, (req, res) => console.log("running on port 3000"));
