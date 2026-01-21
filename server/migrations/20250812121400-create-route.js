'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Routes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      goal: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('goal')
          return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
          this.setDataValue('goal', JSON.stringify(value || []))
        },
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
    await queryInterface.dropTable('Routes')
  },
}
