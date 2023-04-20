const jwt = require('jsonwebtoken');
const { User, Roles, permissions } = require('../models'); // import Sequelize models

function checkPermission(permissionName) {
    return async (req, res, next) => {
        try {
            // Parse the user's JWT token to get their ID
            const token = req.cookies['access_token'];
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const userId = decodedToken.id;

            // Query the database to get the user's permissions
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Roles,
                        as: 'roles',
                        include: [
                            {
                                model: permissions,
                                as: 'permissions',
                                where: { name: permissionName }
                            }
                        ]
                    }
                ]
            });

            // Check if the user has the required permission
            if (user && user.roles.some(role => role.permissions.length > 0)) {
                // User has the required permission, pass control to the next middleware function
                return next();
            } else {
                // User does not have the required permission, return an HTTP 403 Forbidden response
                return res.status(403).json({ error: 'You do not have permission to access this resource' });
            }
        } catch (err) {
            // JWT token is invalid or user is not found in the database
            console.log(err);
            return res.status(401).json({ error: 'You are not authorized to access this resource' });
        }
    };
}

module.exports = checkPermission;