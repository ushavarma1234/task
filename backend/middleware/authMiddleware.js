const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your JWT secret
    req.userId = decoded.id; // Store user ID in request
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};





const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = '38336d836e2dc1efc8c01b8095d2278b24b23b595eba229a0089ed230e32265a37e81f125d97bb40dcf6c249fd160a418a596d84cdc126177aef3810ac43d999'; // Ensure this matches your server key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
