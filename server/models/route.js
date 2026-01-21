'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {
      Route.hasMany(models.Course, {
        foreignKey: 'routeId',
        as: 'courses',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Route.hasMany(models.Common, {
        foreignKey: 'routeId',
        as: 'coursesCommon',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Route.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      slug: { type: DataTypes.STRING, unique: true, allowNull: false },
      description: DataTypes.TEXT,
      goal: {
        type: DataTypes.TEXT,
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
    },
    {
      sequelize,
      modelName: 'Route',
      timestamps: true,
    },
  )
  return Route
}
