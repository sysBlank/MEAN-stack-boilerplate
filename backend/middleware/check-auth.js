const jwt = require('jsonwebtoken');
const defaultError = require('../helpers/customErrors');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies['access_token'];
    if (!token) {
      throw defaultError('No token provided', 401, 'auth_failed')
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = decoded;
    // Reset the token expiration time
    const newToken = jwt.sign(
      {
        username: decoded.username,
        email: decoded.email,
        id: decoded.id
      },
      process.env.TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h"
      }
    );
    res.setHeader('token', newToken);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
      error: error,
      type: 'auth_failed',
    });
  }
};