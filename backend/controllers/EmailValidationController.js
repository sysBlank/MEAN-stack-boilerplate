const UserModel = require('../models').User;
const EmailValidation = require('../models').emailValidationToken;
const { sequelize } = require('../models');

async function validateEmail(id) {
    const t = await sequelize.transaction(); // Initialize transaction
    try {
        const email = await EmailValidation.findOne({
            where: {
                token: id,
                validated: 0,
            }
        });
        
        if(email) { //If no emailToken with validated 0 was found, then skip this and throw error
            await email.update({validated: 1, transaction: t});
            const User = await UserModel.findByPk(email.user_id);
            await User.update({email_verified_at: Date.now(), transaction: t});
        } else {
            throw 'Email already validated or not found';
        }
        
        await t.commit();  // Commit changes if all successful
        return 'Ok';
    } catch (error) {
        await t.rollback(); // Rollback if error
        throw error;
    }
}

module.exports = validateEmail;