const user = require('../models').User;
const emailValidationToken = require('../models').emailValidationToken;
const { sequelize } = require('../models');
const {bcrypt_compare }= require('../tools/bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

 async function createUser(data) {
    const t = await sequelize.transaction();

    try {
    const newUser = user.build(data);

    await newUser.save({transaction: t});

    const newEmailvalidationtoken = emailValidationToken.build({
      user_id: newUser.id,
      token: uuidv4(),
    });

    await newEmailvalidationtoken.save({transaction: t});

    await t.commit();
    return newUser;

    } catch (error) {
      await t.rollback();
      throw error;
    }
 }

 async function loginUser(data) {
        const token_time = 7200;
        const { email, password } = data;
    
        // Validate if user exist in our database
        const foundUser = await user.findOne({ where: { email: email } });

        if(!foundUser) {
          throw 'No user found!';
        }

        if(foundUser.email_verified_at == null) {
          throw 'Email not validated!';
        }

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

          // user
          return {foundUser, token, token_time};
        }
          throw 'Incorrect password';
 }

module.exports = {createUser, loginUser};