'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PageContents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Commons',
          key: 'id',
        },
      },
      orderIndex: {
        type: Sequelize.INTEGER,
      },
      images: {
        type: Sequelize.JSON,
      },
      text: {
        type: Sequelize.TEXT,
      },
      textPosition: {
        type: Sequelize.ENUM,
        values: ['left', 'right'],
        defaultValue: 'left',
        allowNull: false,
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
    await queryInterface.dropTable('PageContents')
  },
}
