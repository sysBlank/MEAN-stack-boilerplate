const { User, Roles, permissions } = require('../../models'); // import Sequelize models
const { Op } = require('sequelize');
const role_permission = require('../../models').role_permission;
const { sequelize } = require('../../models')
const defaultError = require('../../helpers/customErrors');
const moment = require('moment');
const { validationResult } = require('express-validator');

exports.getRoles = async (req, res, next) => {
    const roles = await Roles.findAll();
    res.status(200).json({
        success: true,
        message: 'Roles Index',
        data: roles,
    });
}

exports.editRole = async (req, res, next) => {
    const role_id = req.body.role;
    // get all permissions
    const _permissions = await permissions.findAll();
    const role = await Roles.findByPk(role_id, {
        include: [
            {
                model: permissions,
                as: 'permissions',
            }
        ]
    });
    res.status(200).json({
        success: true,
        message: 'Role Edit',
        data: role,
        permissions: _permissions,
    });
}

exports.updateRole = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        validationResult(req).throw();
        const newRole = req.body.role;
        console.log(newRole)
        const role = await Roles.findByPk(newRole.id);
        role.name = newRole.name;
        await role.save();
        // delete all role permissions
        await role_permission.destroy({
            where: {
                role_id: newRole.id
            }
        }, { transaction: t });
        // add new role permissions
        const rolePermissions = newRole.permissions.map(permission => {
            return {
                role_id: newRole.id,
                permission_id: permission.value,
            }
        });
        await role_permission.bulkCreate(rolePermissions, { transaction: t });
        await t.commit();
        res.status(200).json({
            success: true,
            message: 'Role Updated',
            data: role,
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: 'Role Update Failed',
            error: error,
        });
    }


}

exports.createRole = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        validationResult(req).throw();
        const role = req.body.role;
        const newRole = await Roles.create({
            name: role.name,
        }, { transaction: t });
        const rolePermissions = role.permissions.map(permission => {
            return {
                role_id: newRole.id,
                permission_id: permission.value,
            }
        });
        await role_permission.bulkCreate(rolePermissions, { transaction: t });
        await t.commit();
        res.status(200).json({
            success: true,
            message: 'Role Created',
            data: newRole,
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: 'Role Create Failed',
            error: error,
        });
    }
}