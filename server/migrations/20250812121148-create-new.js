'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('News', {
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
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      images: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('images')
          return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
          this.setDataValue('images', JSON.stringify(value || []))
        },
      },
      metaData: {
        type: Sequelize.JSON,
      },
      type: { type: Sequelize.STRING, defaultValue: 'NEW' },
      forWeb: {
        type: Sequelize.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        defaultValue: 'THEREALIELTS',
      },
      url: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('News')
  },
}
