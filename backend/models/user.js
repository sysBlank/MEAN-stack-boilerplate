'use strict';
const {
  Model
} = require('sequelize');
const { bcrypt } = require('../tools/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.emailValidationToken, {
        foreignKey: 'user_id'
      });
      User.belongsToMany(models.Roles, {
        through: models.user_role,
        foreignKey: 'role_id',
        as: 'roles'
      });
    }
  }

  
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email_verified_at: DataTypes.DATE,
    remember_token: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  

User.beforeCreate(async function(model, options, cb) {
    model.password = await bcrypt(model.password);
  });
  return User;
};