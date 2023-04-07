const { User, Roles } = require('../../models'); // import Sequelize models
const { Op } = require('sequelize');

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
    console.log(user_id);
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