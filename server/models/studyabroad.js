'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class StudyAbroad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudyAbroad.init(
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
      isActive: { type: DataTypes.BOOLEAN, default: true },
      type: { type: DataTypes.STRING, defaultValue: 'STUDYABROAD' },
      metaData: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: 'StudyAbroad',
      timestamps: true,
    },
  )
  return StudyAbroad
}
