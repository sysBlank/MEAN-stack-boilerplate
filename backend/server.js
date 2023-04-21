const express = require('express');
const cookieParser = require('cookie-parser');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const authRouter = require('./router/auth');
const apiRouter = require('./router/api');
const adminApiRouter = require('./router/adminApi');
const rateLimit = require('express-rate-limit');
const checkAuth = require('./middleware/check-auth');
const isAdmin = require('./middleware/is-admin');
require('dotenv').config();

const app = express();
const port = process.env.port || 3000;
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again later',
});

app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//On request console log the body
app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(apiLimiter);
app.use('/api/auth', authRouter);
app.use('/api/admin', checkAuth, isAdmin, adminApiRouter);
app.use('/api', checkAuth, apiRouter);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
