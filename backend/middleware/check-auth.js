const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
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
        expiresIn: "15m"
      }
    );
    res.setHeader('token', newToken);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
};