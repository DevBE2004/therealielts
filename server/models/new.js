'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class New extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  New.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      slug: { type: DataTypes.STRING, unique: true, allowNull: false },
      description: DataTypes.TEXT,
      images: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('images')
          return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
          this.setDataValue('images', JSON.stringify(value || []))
        },
      },
      forWeb: {
        type: DataTypes.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        defaultValue: 'THEREALIELTS',
      },
      type: { type: DataTypes.STRING, defaultValue: 'NEW' },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      url: DataTypes.STRING,
      category: DataTypes.STRING,
      metaData: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: 'New',
      timestamps: true,
    },
  )
  return New
}
