'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Roles.belongsToMany(models.User, {
        through: models.user_role,
        foreignKey: 'role_id',
        as: 'users'
      });
      // Get all permissions for this role
      Roles.belongsToMany(models.permissions, {
        through: models.role_permission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions'
      });
    }
  }
  Roles.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'roles',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Roles;
};