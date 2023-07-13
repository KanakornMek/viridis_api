const jwt =require('jsonwebtoken')
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
module.exports=verifyToken;
