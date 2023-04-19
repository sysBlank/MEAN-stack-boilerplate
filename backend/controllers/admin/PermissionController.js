const { User, Roles, permissions } = require('../../models'); // import Sequelize models
const { Op } = require('sequelize');
const role_permission = require('../../models').role_permission;
const { sequelize } = require('../../models')
const defaultError = require('../../helpers/customErrors');
const moment = require('moment');
const { validationResult } = require('express-validator');

exports.getPermissions = async (req, res, next) => {
    const _permissions = await permissions.findAll();
    res.status(200).json({
        success: true,
        message: 'Permissions Index',
        data: _permissions,
    });
}