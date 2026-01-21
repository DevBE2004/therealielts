"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ExamRegistrations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      mobile: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      organization: {
        type: Sequelize.STRING,
      },
      module: {
        type: Sequelize.STRING,
      },
      form: {
        type: Sequelize.STRING,
      },
      examDate: {
        type: Sequelize.DATE,
      },
      mailingAddress: {
        type: Sequelize.STRING,
      },
      promotionalProduct: {
        type: Sequelize.STRING,
      },
      passport: {
        type: Sequelize.STRING,
      },
      registrationObject: {
        type: Sequelize.STRING,
      },
      bill: {
        type: Sequelize.STRING,
      },
      isConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ExamRegistrations");
  },
};
