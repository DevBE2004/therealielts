'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lesson.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      Lesson.belongsTo(models.Common, {
        foreignKey: 'commonId',
        as: 'common',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Lesson.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      description: { type: DataTypes.TEXT },
      details: { type: DataTypes.TEXT },
      order_index: DataTypes.INTEGER,
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Course',
          key: 'id',
        },
      },
      commonId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Common',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Lesson',
      timestamps: true,
    },
  )
  return Lesson
}
