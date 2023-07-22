const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const verifyToken = require("./src/utils/verifyjwt");
const tokenRouter = require("./src/routers/token");
const userRouter = require("./src/routers/user");

app.use(express.json());

const port = 4000;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("connected to database");
});
app.use("/", verifyToken);

app.use("/token", tokenRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
