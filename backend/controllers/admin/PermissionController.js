const { User, Roles, permissions } = require('../../models'); // import Sequelize models
const { Op } = require('sequelize');
const role_permission = require('../../models').role_permission;
const { sequelize } = require('../../models')
const defaultError = require('../../helpers/customErrors');
const moment = require('moment');
const { validationResult } = require('express-validator');

exports.getPermissions = async (req, res, next) => {
    try {
        const _permissions = await permissions.findAll();
        res.status(200).json({
            success: true,
            message: 'Permissions Index',
            data: _permissions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error Getting Permissions',
            error: error,
        });
    }
}

exports.editPermission = async (req, res, next) => {
    try {
        const permission_id = req.body.permission;
        decodeURI(permission_id);
        const permission = await permissions.findByPk(permission_id);
        res.status(200).json({
            success: true,
            message: 'Permission Edit',
            data: permission,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error Editing Permission',
            error: error,
        });
    }
}

exports.updatePermission = async (req, res, next) => {
    try {
        const permission = req.body.permission;
        const _permission = await permissions.findByPk(permission.id);
        _permission.name = permission.name;
        _permission.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        await _permission.save();
        res.status(200).json({
            success: true,
            message: 'Permission Updated',
            data: _permission,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error Updating Permission',
            error: error,
        });
    }
}

exports.deletePermission = async (req, res, next) => {
    try {
        const id = req.body.permission;
        const permission = await permissions.findByPk(id);
        await permission.destroy();
        res.status(200).json({
            success: true,
            message: 'Permission Deleted',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error Deleting Permission',
            error: error,
        });
    }
}

exports.createPermission = async (req, res, next) => {
    try {
        const permission = await permissions.create({
            name: req.body.permission.name,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        res.status(200).json({
            success: true,
            message: 'Permission Created',
            data: permission,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error Creating Permission',
            error: error,
        });
    }
}