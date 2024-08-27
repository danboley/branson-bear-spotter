"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pois", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Address must not be empty." },
        },
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          isValidLatitude(lat) {
            if (typeof lat !== "number" || lat < -90 || lat > 90) {
              throw new Error("Invalid latitude.");
            }
          },
        },
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          isValidLongitude(long) {
            if (typeof long !== "number" || long < -180 || long > 180) {
              throw new Error("Invalid longitude.");
            }
          },
        },
      },
      approvalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["active", "denied", "pending"]],
        },
      },
      approvalNotes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imagePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Pois");
  },
};
