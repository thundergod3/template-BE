"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fullName: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      phoneNumber: { type: Sequelize.STRING },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      roles: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: ["tenant"],
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "active", // ENUM: inActive | active
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
