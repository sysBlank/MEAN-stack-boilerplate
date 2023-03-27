'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class emailValidationToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  emailValidationToken.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'emailValidationToken',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return emailValidationToken;
};