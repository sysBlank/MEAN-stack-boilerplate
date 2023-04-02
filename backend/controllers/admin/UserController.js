const user = require('../models').User;

exports.index = async (req, res, next) => {
    // Get all users
    const users = await user.findAll();
    res.status(201).json({
        success: true,
        message: 'Users Index',
    });
}