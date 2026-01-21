'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Introduces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      section1: {
        type: Sequelize.JSON,
      },
      images1: {
        type: Sequelize.JSON,
      },
      section2: {
        type: Sequelize.JSON,
      },
      images2: {
        type: Sequelize.JSON,
      },
      section3: {
        type: Sequelize.JSON,
      },
      images3: {
        type: Sequelize.JSON,
      },
      section4: {
        type: Sequelize.JSON,
      },
      images4: {
        type: Sequelize.JSON,
      },
      section5: {
        type: Sequelize.JSON,
      },
      images5: {
        type: Sequelize.JSON,
      },
      section6: {
        type: Sequelize.JSON,
      },
      images6: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Introduces')
  },
}
