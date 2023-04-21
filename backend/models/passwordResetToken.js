const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class passwordResetToken extends Model {
    static associate(models) {
      passwordResetToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  passwordResetToken.init({
    reset_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id"
      }
    },
    token_expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    }
  }, {
    sequelize,
    modelName: "passwordResetToken",
    tableName: "passwordresettokens",
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return passwordResetToken;
};
