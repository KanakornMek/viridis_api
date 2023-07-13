const jwt =require('jsonwebtoken')
const fs = require('fs');

const publickey = fs.readFileSync((__dirname.split('src/utils'))[0] + 'public.key')

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'undefined') {
      const token = authHeader.split(' ')[1];
     
      jwt.verify(token, publickey, (err, decoded) => {
        if (err) {
          
          return res.sendStatus(403);
        }
        
        
        req.user = decoded;
        
        next();
      });
    } else {
      
      res.sendStatus(401);
    }
}
module.exports=verifyToken;
