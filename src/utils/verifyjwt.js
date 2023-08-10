const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path')
const publickey = fs.readFileSync(path.join(__dirname, '..', '..', 'public.key'));

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    console.log(__dirname)
    jwt.verify(token, publickey, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(403).json({message: 'jwt expired'});
      }


      req.user = decoded;

      next();
    });
  } else {
    return res.sendStatus(401)
  }
}
module.exports = verifyToken;
