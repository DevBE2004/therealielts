'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
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
      type: { type: Sequelize.STRING, defaultValue: 'COURSE' },
      metaData: {
        type: Sequelize.JSON,
      },
      routeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      duration: {
        type: Sequelize.STRING,
      },
      totalHours: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      level: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '[0,0]',
        get() {
          const rawValue = this.getDataValue('level')
          try {
            return JSON.parse(rawValue)
          } catch {
            return [0, 0]
          }
        },
        set(value) {
          this.setDataValue('level', JSON.stringify(value))
        },
      },
      target: {
        type: Sequelize.FLOAT,
      },
      benefit: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('benefit')
          try {
            return JSON.parse(rawValue)
          } catch {
            return []
          }
        },
        set(value) {
          this.setDataValue('benefit', JSON.stringify(value))
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
    await queryInterface.dropTable('Courses')
  },
}
