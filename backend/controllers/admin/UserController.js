const user = require('../models').User;

exports.index = async (req, res, next) => {
    // check user permissions to see if they can access this page
    res.status(201).json({
        success: true,
        message: 'Users Index',
    });
}