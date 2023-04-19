const express = require('express')
const adminApiRouter = express.Router();
const rateLimit = require("express-rate-limit");
const checkPermission = require('../middleware/auth-guard');
const { getUsers, editUser, updateUser, createUser } = require('../controllers/admin/UserController');
const { getRoles, editRole, updateRole, createRole } = require('../controllers/admin/RoleController');
const { getPermissions } = require('../controllers/admin/PermissionController');
const { userValidator, roleValidator } = require('../router/validators/validator');
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "Too many attempts, please try again later"
});

adminApiRouter.route("/users/get").post([authLimiter], getUsers); // Test permission check
adminApiRouter.route("/users/edit").post([authLimiter], editUser); // Test permission check
adminApiRouter.route("/users/update").post([authLimiter, userValidator], updateUser); // Test permission check
adminApiRouter.route("/users/create").post([authLimiter, userValidator], createUser); // Test permission check
//Role routes
adminApiRouter.route("/roles/get").get([authLimiter], getRoles); // Test permission check
adminApiRouter.route("/roles/edit").post([authLimiter], editRole); // Test permission check
adminApiRouter.route("/roles/update").post([authLimiter, roleValidator], updateRole); // Test permission check
adminApiRouter.route("/roles/create").post([authLimiter, roleValidator], createRole); // Test permission check (same as update

// Permissions routes
adminApiRouter.route("/permissions/get").get([authLimiter], getPermissions); // Test permission check
module.exports = adminApiRouter;