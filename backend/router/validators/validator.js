const { check, body } = require('express-validator');
const user = require('../../models').User;
///////////////////////////////
///////////////////////////////
//Need to also check for existence of the fields, not only if they are correct.
///////////////////////////////
///////////////////////////////
const loginValidator = [
    check('email').exists().withMessage('Email is required'),
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').exists().withMessage('Password is required'),
    check('password').isLength({ min: 8, max: 24 }).withMessage('Password length must be between 8-24 characters'),
]
const accountEmailValidationValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid Email'),
]

const forgotPasswordValidator = [
    check('email').exists().withMessage('Email is required'),
    check('email')
        .isEmail()
        .withMessage('Invalid Email'),
]
const resetPasswordValidator = [
    check('password').exists().withMessage('Password is required'),
    check('password')
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1 })
        .withMessage('Password must contain 1 uppercase character, 1 lowerchase character and one symbol')
        .isLength({ min: 8, max: 24 })
        .withMessage('Password length must be between 8-24 characters'),
]

const registerValidator = [
    check('email').exists().withMessage('Email is required'),
    check('email')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(email => {
            return new Promise((resolve, reject) => {
                const exisitngUser = user.findOne({
                    where: {
                        email: email,
                    }
                }).then(result => {
                    if (result) {
                        reject();
                    }
                    resolve();
                })
            })
        }).withMessage('Email already exists'),
    check('username').exists().withMessage('Username is required'),
    check('username')
        .isAlphanumeric('en-US')
        .withMessage('Invalid Username')
        .isLength({ min: 5, max: 24 })
        .withMessage('Username length must be between 5-24 characters')
        .custom(username => {
            return new Promise((resolve, reject) => {
                const exisitngUser = user.findOne({
                    where: {
                        username: username,
                    }
                }).then(result => {
                    if (result) {
                        reject();
                    }

                    resolve();
                })
            })
        }).withMessage('Username already exists'),
    check('password').exists().withMessage('Password is required'),
    check('password')
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1 })
        .withMessage('Password must contain 1 uppercase character, 1 lowerchase character and one symbol')
        .isLength({ min: 8, max: 24 })
        .withMessage('Password length must be between 8-24 characters'),
]

const userValidator = [
    check('user.email').exists().withMessage('Email is required'),
    check('user.email')
        .isEmail()
        .withMessage('Invalid Email'),
    check('user.username').exists().withMessage('Username is required'),
    check('user.username')
        .isAlphanumeric('en-US')
        .withMessage('Invalid Username')
        .isLength({ min: 5, max: 24 })
        .withMessage('Username length must be between 5-24 characters'),
]
const roleValidator = [
    check('role.name').exists().withMessage('Email is required'),
    check('role.name').isLength({ min: 3, max: 24 }).withMessage('Role name length must be between 3-24 characters'),
    check('role.name').isAlphanumeric('en-US').withMessage('Invalid Role name'),
]

module.exports = { roleValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, registerValidator, accountEmailValidationValidator, userValidator };