'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Commons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      urlYoutube: {
        type: Sequelize.STRING,
      },
      descriptionSidebar: {
        type: Sequelize.STRING,
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
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      routeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Routes',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM,
        values: ['COURSE', 'DOCUMENT', 'NEW', 'STUDYABROAD', 'PAGE'],
        defaultValue: 'COURSE',
      },
      totalHours: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      metaData: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      level: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '[0,0]',
        get() {
          const rawValue = this.getDataValue('level')
          try {
            return rawValue ? JSON.parse(rawValue) : [0, 0]
          } catch {
            return [0, 0]
          }
        },
        set(value) {
          this.setDataValue('level', JSON.stringify(value || [0, 0]))
        },
      },
      target: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      benefit: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('benefit')
          try {
            return rawValue ? JSON.parse(rawValue) : []
          } catch {
            return []
          }
        },
        set(value) {
          this.setDataValue('benefit', JSON.stringify(value || []))
        },
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      forWeb: {
        type: Sequelize.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        allowNull: true,
        defaultValue: 'THEREALIELTS',
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('Commons')
  },
}
