const express = require('express')
const adminApiRouter = express.Router();
const rateLimit = require("express-rate-limit");
const checkPermission = require('../middleware/auth-guard');
const getUsers = require('../controllers/admin/UserController').getUsers;
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "Too many attempts, please try again later"
});

adminApiRouter.route("/users/get").post([authLimiter], getUsers); // Test permission check

module.exports = adminApiRouter;