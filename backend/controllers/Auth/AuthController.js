const { Op } = require('sequelize');
const { bcrypt_compare, bcrypt } = require('../../tools/bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const user = require('../../models').User;
const PasswordResetToken = require('../../models').passwordResetToken;
const user_role = require('../../models').user_role;
const { emailValidationToken, sequelize } = require('../../models')
const { sendRegistrationEmail, sendValidationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../../tools/mailSender');
const { validationResult } = require('express-validator');
const defaultError = require('../../helpers/customErrors');

exports.register = async (req, res, next) => {

  const data = req.body;
  //Initialize DB transaction
  const t = await sequelize.transaction();
  //Registration logic starts here
  try {
    //Throw validation error if exists
    validationResult(req).throw();
    //Build user model with received data
    const newUser = user.build(data);
    //Save user to database
    await newUser.save({ transaction: t });
    //Create role for user
    const giveRole = user_role.build({
      user_id: newUser.id,
      role_id: 2,
    });
    //Save role for user
    await giveRole.save({ transaction: t });
    //Build ValidationToken model for new user
    const newEmailvalidationtoken = emailValidationToken.build({
      user_id: newUser.id,
      token: uuidv4(),
    });
    //Save Validation token to database
    await newEmailvalidationtoken.save({ transaction: t });
    //Send registration email
    sendRegistrationEmail(newUser, newEmailvalidationtoken.token);
    //If everything was successful commit the transaction
    await t.commit();
    // Send back success response
    res.status(201).json({
      success: true,
    });

  } catch (error) {
    //If error rollback transaction
    await t.rollback();
    //Send back failure response
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      validationErrors: error.errors,
    });
  }
}

exports.login = async (req, res, next) => {
  try {
    //Throw validation error if exists
    validationResult(req).throw();

    const token_time = 7200; // set token to expire in 2h
    const { email, password } = req.body;
    //Validate if user exist in our database
    const foundUser = await user.findOne({ where: { email: email } });
    //If user does not exists return error
    if (!foundUser) {
      throw new defaultError("Invalid email or password", 401);
    }
    //If user exists but email is not verified then return error
    if (foundUser.email_verified_at == null) {
      throw new defaultError("User email is not verified", 401);
    }
    //If user exists and passwords match, create token
    if (foundUser && (await bcrypt_compare(password, foundUser.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: foundUser._id, email },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
          expiresIn: token_time,
        }
      );
      //Set auth cookie
      res.cookie("access_token", token, { maxAge: token_time * 1000, httpOnly: true });
      //Return success message with new cookie containing token
      res.status(201).json({
        success: true,
        data: {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email
        },
      });
    } else {
      //If user found but password is incorrect throw error
      throw new defaultError("Invalid email or password", 401);
    }
  } catch (error) {
    //If user found but password is incorrect throw error
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      validationErrors: error.errors,
    });
  }

}

exports.validateEmailToken = async (req, res, next) => {
  const token = req.body.token;
  //Initialize transaction
  const t = await sequelize.transaction();
  //Email validation logic starts here
  try {
    //Throw validation error if exists
    validationResult(req).throw();
    //Find if there is email awaiting validation
    const emailToken = await emailValidationToken.findOne({
      where: {
        token: token,
        validated: 0,
      }
    });
    //If no emailToken with validated 0 was found, then skip this and throw error
    if (emailToken) {
      await emailToken.update({ validated: 1, transaction: t });
      const findUser = await user.findByPk(emailToken.user_id);
      await findUser.update({ email_verified_at: Date.now(), transaction: t });
    } else {
      throw new defaultError("Invalid Token.", 401);
    }
    //Commit changes if successful
    await t.commit();
    //Return success response
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    //Rollback if error
    await t.rollback();
    //Return response with error message
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      validationErrors: error.errors,
    });
  }
}

exports.sentAccountValidationEmail = async (req, res, next) => {
  const minTime = 900; //Time in seconds that must past between requests
  const email = req.body.email;
  //SendValidation logic starts here
  //Initialize transaction
  const t = await sequelize.transaction();
  try {
    //Throw validation error if exists
    validationResult(req).throw();
    //Find user with email
    const userExists = await user.findOne({
      where: {
        email: email,
      },
      include: [{
        model: emailValidationToken
      }]
    })
    //If user already registered then return error or already validated
    if (!userExists) {
      throw new defaultError("Invalid email address", 401);
    } else if (userExists.emailValidationToken && userExists.emailValidationToken.validated == true) {
      throw new defaultError("Invalid email address", 401);
    }
    const elapsedTime = calculateElapsedTime(userExists.emailValidationToken.updated_at);
    if (elapsedTime < minTime) {
      throw new defaultError(`At least ${minTime / 60} minutes must pass before another request`, 400);
    }
    //Flag attribute as changed or update wont work
    userExists.emailValidationToken.changed('updated_at', true);
    //Update
    await userExists.emailValidationToken.update({ updated_at: new Date(), transaction: t })
    //If no emailToken with validated 0 was found, then skip this and throw error
    sendValidationEmail(userExists, userExists.emailValidationToken.token);
    //Commit transaction
    await t.commit();
    //Return success response
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    //Rollback if error
    await t.rollback();
    //Return response with error message
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      validationErrors: error.errors,
    });
  }
}

exports.forgotPassword = async (req, res, next) => {

  const t = await sequelize.transaction();
  try {
    validationResult(req).throw();
    const { email } = req.body;
    const findUser = await user.findOne({
      where: {
        email: email,
      }
    })
    if (!findUser) {
      throw new defaultError("Invalid email address", 400);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const passwordResetToken = await PasswordResetToken.findOne({ where: { user_id: findUser.id } });
    if (!passwordResetToken) {
      newToken = PasswordResetToken.build({
        reset_token: resetToken,
        user_id: findUser.id,
        token_expiration_date: resetTokenExpiry,
      });
      await newToken.save({ transaction: t });
    } else {
      const currentTimestamp = Date.now();
      const tokenExpiryTimestamp = Date.parse(passwordResetToken.token_expiration_date);

      if (currentTimestamp <= tokenExpiryTimestamp) {
        throw new defaultError('There is already a request for this email. Please check your email.', 401);
      }
      await passwordResetToken.update({
        reset_token: resetToken,
        user_id: findUser.id,
        token_expiration_date: resetTokenExpiry
      }, { transaction: t });
    }

    // send reset password email with resetToken
    sendPasswordResetEmail(findUser, resetToken);

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Password reset email sent.',
    });
  } catch (error) {
    await t.rollback();
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      validationErrors: error.errors,
    });
  }
};


exports.resetPassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  console.log(req.body);
  try {
    const { password, token } = req.body;

    const passwordResetToken = await PasswordResetToken.findOne({ where: { reset_token: token } });
    if (!passwordResetToken) {
      throw new defaultError('Invalid password reset link!', 400);
    }
    const currentTimestamp = Date.now();
    const tokenExpiryTimestamp = Date.parse(passwordResetToken.token_expiration_date);

    if (currentTimestamp >= tokenExpiryTimestamp) {
      throw new defaultError('Token expired!', 400);
    }

    const findUser = await user.findByPk(passwordResetToken.user_id);

    if (!findUser) {
      throw new defaultError('An unexpected error occurred. Please try again later.', 500);
    }

    // Check if password is valid
    validationResult(req).throw();

    await findUser.update({
      password: await bcrypt(password),
    })

    await passwordResetToken.destroy();

    // send reset password email with resetToken
    sendPasswordResetSuccessEmail(findUser);

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Password reset.',
    });
  } catch (error) {
    await t.rollback();
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      validationErrors: error.errors,
    });
  }
}

function calculateElapsedTime(date) {
  let timeDif = new Date() - date;
  timeDif /= 1000;
  let seconds = Math.round(timeDif);
  return seconds;
}