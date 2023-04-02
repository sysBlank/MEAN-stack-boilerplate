const express = require('express')
const router = express.Router();
const { register, login, validateEmailToken, resetConfirmEmailToken, forgotPassword, resetPassword, sentAccountValidationEmail } = require('../controllers/Auth/AuthController');
const { loginValidator, accountEmailValidationValidator, resetPasswordValidator, registerValidator, forgotPasswordValidator } = require('../router/validators/validator');
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many attempts, please try again later"
});

//Takes username, password, email
router.route("/register").post([
    authLimiter,
    registerValidator
], register);

//Takes email, password
router.route("/login").post([
    authLimiter,
    loginValidator
], login);

//Takes email
router.route("/sendAccountValidationMail").post([
    authLimiter,
    accountEmailValidationValidator
], sentAccountValidationEmail);

//takes email
router.route("/forgotpassword").post([
    authLimiter,
    forgotPasswordValidator
], forgotPassword);

//takes reset_token, password
router.route("/resetpassword").post([
    authLimiter,
    resetPasswordValidator
], resetPassword);

//Takes token as id
router.route("/validate-email-token").post([
    authLimiter
], validateEmailToken);
//Takes token as id
router.route("/resetConfirmEmailToken").post([
    authLimiter
], resetConfirmEmailToken);

module.exports = router;