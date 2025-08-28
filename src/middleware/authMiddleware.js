const jwt = require('jsonwebtoken');

const JWT_SECRET = 'RCk3WsM1iRsjxJD3cQE2OMIdpwRO4Dwz'; // Use the same secret as in server.js

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
