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
        foreignKey: 'user_id',
        as: 'roles'
      });
    }
  }


  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [3, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3, 50]
      }
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    remember_token: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    paranoid: true,
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  });

  User.beforeCreate(async function (model, options, cb) {
    model.password = await bcrypt(model.password);
  });

  User.beforeUpdate(async function (model, options, cb) {
    model.password = await bcrypt(model.password);
  });
  return User;
};