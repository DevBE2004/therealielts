'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Common extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Common.belongsTo(models.Route, {
        foreignKey: 'routeId',
        as: 'route',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Common.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Common.hasMany(models.Lesson, {
        foreignKey: 'commonId',
        as: 'lessons',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Common.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Common.hasMany(models.PageContents, {
        foreignKey: 'pageId',
        as: 'pageContents',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Common.init(
    {
      title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },
      urlYoutube: {
        type: DataTypes.STRING,
      },
      descriptionSidebar: {
        type: DataTypes.STRING,
      },
      images: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      routeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Route',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM,
        values: ['COURSE', 'DOCUMENT', 'NEW', 'STUDYABROAD', 'PAGE'],
        defaultValue: 'COURSE',
      },
      totalHours: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      metaData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      level: {
        type: DataTypes.TEXT,
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
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      benefit: {
        type: DataTypes.TEXT,
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
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      forWeb: {
        type: DataTypes.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        allowNull: true,
        defaultValue: 'THEREALIELTS',
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Common',
    },
  )
  return Common
}
