const express = require('express');
require('dotenv').config()
const app = express();

const port = 4000;
app.connect(process.env.MONGO_URL)
const tokenRouter = require('./routers/token')
const userRouter = require('./routers/user')
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'undefined') {
      const token = authHeader.split(' ')[1];
  
      // Verify the token
      jwt.verify(token, 'praram', (err, decoded) => {
        if (err) {
          // Token verification failed
          return res.sendStatus(403);
        }
        
        // Token is valid, store the decoded payload for future use
        req.user = decoded;
        
        // Call the next middleware
        next();
      });
    } else {
      // No authorization header present
      res.sendStatus(401);
    }
}
app.use('/', verifyToken);
const user= require('./model/user')
const wallet= require('./model/wallet')
const Transactions= require('./model/Transactions')

app.use('/token', tokenRouter);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})