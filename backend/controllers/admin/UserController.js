const user = require('../../models').User;
const { Op } = require('sequelize');

exports.getUsers = async (req, res, next) => {
    console.log(req.body);
    const { pageLimit, offset, sortColumn, sortDirection, search } = req.body.pageInfo;
    const limit = pageLimit;

    // Sequelize get all users exclude password
    const users = await user.findAll({
        attributes: { exclude: ['password'] },
        offset: (offset) * limit, // Calculate offset based on currentPage and limit
        limit,
        order: [[sortColumn, sortDirection]],
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
        count = await user.count();
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