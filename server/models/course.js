'use strict'
const { Model, Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Route, {
        foreignKey: 'routeId',
        as: 'route',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Course.hasMany(models.Lesson, {
        foreignKey: 'courseId',
        as: 'lessons',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Course.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      slug: { type: DataTypes.STRING, unique: true, allowNull: false },
      description: DataTypes.TEXT,
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
      duration: DataTypes.STRING,
      routeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Route',
          key: 'id',
        },
      },
      type: { type: DataTypes.STRING, defaultValue: 'COURSE' },
      totalHours: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      metaData: {
        type: DataTypes.JSON,
      },
      level: {
        type: DataTypes.TEXT,
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
        type: DataTypes.FLOAT,
      },
      benefit: {
        type: DataTypes.TEXT,
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
    },
    {
      sequelize,
      modelName: 'Course',
      timestamps: true,
    },
  )
  return Course
}
