const jwt = require('jsonwebtoken');
const defaultError = require('../helpers/customErrors');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies['access_token'];
    if (!token) {
      throw defaultError('Auth failed', 401, 'auth_failed')
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
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
        expiresIn: process.env.TOKEN_EXPIRATION
      }
    );
    res.cookie("access_token", newToken, { maxAge: process.env.TOKEN_EXPIRATION * 1000, httpOnly: true, secure: true });
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
      error: error,
      type: 'auth_failed',
    });
  }
};