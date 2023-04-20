const express = require('express')
const adminApiRouter = express.Router();
const rateLimit = require("express-rate-limit");
const checkPermission = require('../middleware/auth-guard');
const { getUsers, editUser, updateUser, createUser, deleteUser } = require('../controllers/admin/UserController');
const { getRoles, editRole, updateRole, createRole, deleteRole } = require('../controllers/admin/RoleController');
const { getPermissions, editPermission, updatePermission, createPermission, deletePermission } = require('../controllers/admin/PermissionController');
const { userValidator, roleValidator, permissionValidator } = require('../router/validators/validator');
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "Too many attempts, please try again later"
});

adminApiRouter.route("/users/get").post([authLimiter, checkPermission('user_access')], getUsers); // Test permission check
adminApiRouter.route("/users/edit").post([authLimiter, checkPermission('user_edit')], editUser); // Test permission check
adminApiRouter.route("/users/update").post([authLimiter, checkPermission('user_edit'), userValidator], updateUser); // Test permission check
adminApiRouter.route("/users/create").post([authLimiter, checkPermission('user_create'), userValidator], createUser); // Test permission check
adminApiRouter.route("/users/delete").post([authLimiter, checkPermission('user_delete')], deleteUser); // Test permission check
//Role routes
adminApiRouter.route("/roles/get").get([authLimiter, checkPermission('role_access')], getRoles); // Test permission check
adminApiRouter.route("/roles/edit").post([authLimiter, checkPermission('role_edit')], editRole); // Test permission check
adminApiRouter.route("/roles/update").post([authLimiter, checkPermission('role_edit'), roleValidator], updateRole); // Test permission check
adminApiRouter.route("/roles/create").post([authLimiter, checkPermission('role_create'), roleValidator], createRole); // Test permission check (same as update
adminApiRouter.route("/roles/delete").post([authLimiter, checkPermission('role_delete')], deleteRole); // Test permission check
// Permissions routes
adminApiRouter.route("/permissions/get").get([authLimiter, checkPermission('permission_access')], getPermissions); // Test permission check
adminApiRouter.route("/permissions/edit").post([authLimiter, checkPermission('permission_edit')], editPermission); // Test permission check
adminApiRouter.route("/permissions/update").post([authLimiter, checkPermission('permission_edit'), permissionValidator], updatePermission); // Test permission check
adminApiRouter.route("/permissions/create").post([authLimiter, checkPermission('permission_create'), permissionValidator], createPermission); // Test permission check
adminApiRouter.route("/permissions/delete").post([authLimiter, checkPermission('permission_delete')], deletePermission); // Test permission check

module.exports = adminApiRouter;