"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Poi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Poi.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Poi.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name must not be empty." },
          len: {
            args: [3, 100],
            msg: "Name must be between 3 and 100 characters.",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Address must not be empty." },
        },
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isValidLatitude(value) {
            if (typeof value === "string") value = parseFloat(value);
            if (value < -90 || value > 90) {
              throw new Error("Invalid latitude.");
            }
          },
        },
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isValidLongitude(value) {
            if (typeof value === "string") value = parseFloat(value);
            if (value < -180 || value > 180) {
              throw new Error("Invalid longitude.");
            }
          },
        },
      },
      approvalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["active", "denied", "pending"]],
        },
      },
      approvalNotes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Poi",
    }
  );
  return Poi;
};
