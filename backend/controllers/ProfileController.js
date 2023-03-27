const user = require('../models').User;

exports.index = async (req, res, next) => {
    res.status(201).json({
        success: true,
        message: 'Profile Page',
      });
}