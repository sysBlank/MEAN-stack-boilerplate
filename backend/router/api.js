const express = require('express')
const apiRouter = express.Router();
const rateLimit = require("express-rate-limit");
const checkPermission = require('../middleware/auth-guard');
const index = require('../controllers/ProfileController').index;
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "Too many attempts, please try again later"
});

apiRouter.route("/profile").post([authLimiter, checkPermission('user_access')], index); // Test permission check

module.exports = apiRouter;