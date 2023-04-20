export const BASE_URL = 'http://localhost:3000/api/';
export const AUTH_API = BASE_URL + 'auth/';
export const LOGIN_API = AUTH_API + 'login';
export const REGISTER_API = AUTH_API + 'register';
export const CONFIRM_EMAIL_API = AUTH_API + 'validate-email-token';
export const FORGOT_PASSWORD_API = AUTH_API + 'forgotpassword';
export const RESET_PASSWORD_API = AUTH_API + 'resetpassword';
export const RESEND_CONFIRMATION_EMAIL_API = AUTH_API + 'resetConfirmEmailToken';

// Admin API
const ADMIN_API = BASE_URL + 'admin/';
export const USERS_API = ADMIN_API + 'users/';
export const GET_USERS_API = USERS_API + 'get';
export const EDIT_USER_API = USERS_API + 'edit';
export const UPDATE_USER_API = USERS_API + 'update';
export const CREATE_USER_API = USERS_API + 'create';
export const DELETE_USER_API = USERS_API + 'delete';
// Roles API
const ROLES_API = ADMIN_API + 'roles/';
export const GET_ROLES_API = ROLES_API + 'get';
export const EDIT_ROLE_API = ROLES_API + 'edit';
export const UPDATE_ROLE_API = ROLES_API + 'update';
export const CREATE_ROLE_API = ROLES_API + 'create';
export const DELETE_ROLE_API = ROLES_API + 'delete';
// Permissions API
const PERMISSIONS_API = ADMIN_API + 'permissions/';
export const GET_PERMISSIONS_API = PERMISSIONS_API + 'get';
export const EDIT_PERMISSION_API = PERMISSIONS_API + 'edit';
export const UPDATE_PERMISSION_API = PERMISSIONS_API + 'update';
export const CREATE_PERMISSION_API = PERMISSIONS_API + 'create';
export const DELETE_PERMISSION_API = PERMISSIONS_API + 'delete';
