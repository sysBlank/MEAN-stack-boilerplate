const { User, Roles } = require('../../models'); // import Sequelize models
const { Op } = require('sequelize');
const user_role = require('../../models').user_role;
const { sequelize } = require('../../models')
const defaultError = require('../../helpers/customErrors');
const moment = require('moment');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res, next) => {
    console.log(req.body);
    const { pageLimit, offset, sortColumn, sortDirection, search } = req.body.pageInfo;
    const limit = pageLimit;

    // Sequelize get all users exclude password
    const users = await User.findAll({
        attributes: { exclude: ['password'] },
        offset: (offset) * limit, // Calculate offset based on currentPage and limit
        limit,
        order: [[sortColumn, sortDirection]],
        include: [
            {
                model: Roles,
                as: 'roles',
                attributes: ['name'],
            }
        ],
        where: search ? {
            [Op.or]: [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { id: { [Op.like]: `%${search}%` } },
            ],
        } : {}
    });
    let count = 0;
    if (!search) {
        // Sequelize count all users
        count = await User.count();
    } else {
        count = users.length;
    }

    res.status(200).json({
        success: true,
        message: 'Users Index',
        data: users,
        offset: offset,
        totalPages: Math.ceil(count / limit),
        total: count,
    });
};

exports.editUser = async (req, res, next) => {
    const user_id = req.body.user;
    const user = await User.findByPk(user_id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Roles,
                as: 'roles',
                attributes: ['name', 'id'],
            }
        ],
    });
    // Get all roles
    const roles = await Roles.findAll({
        attributes: ['id', 'name'],
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
    // Add all roles to user as allRoles
    user.dataValues.allRoles = roles;
    res.status(200).json({
        success: true,
        message: 'User Edit',
        data: user,
    });
}

exports.updateUser = async (req, res, next) => {
    const newUser = req.body.user;
    // Find user by id
    const t = await sequelize.transaction();

    try {
        validationResult(req).throw();

        const user = await User.findByPk(newUser.id);
        if (!user) {
            throw new defaultError("User not found!", 404);
        }

        // Delete all roles for user
        await user_role.destroy({
            where: {
                user_id: user.id,
            },
            transaction: t,
        });

        // Add new roles for user
        const roles = newUser.roles;
        console.log(roles);
        await roles.forEach(role => {
            console.log(role);
            user_role.build({
                user_id: user.id,
                role_id: role.value,
            }, { transaction: t }).save({ transaction: t });
        });
        await user.set({
            username: newUser.username,
            email: newUser.email,
            active: newUser.active.value,
            // Format email_verified_at with momentjs
            email_verified_at: newUser.email_verified_at ? moment(newUser.email_verified_at, 'DD/MM/YYYY HH:mm').toDate() : null,
            // Change password only if password field is not empty
            password: newUser.password ? newUser.password : user.password,


        });
        await user.save({ transaction: t });
        // Commit transaction
        await t.commit();
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
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