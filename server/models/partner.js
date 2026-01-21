'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Partner.init(
    {
      name: DataTypes.STRING,
      category: DataTypes.STRING,
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
      forWeb: {
        type: DataTypes.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        defaultValue: 'THEREALIELTS',
      },
    },
    {
      sequelize,
      modelName: 'Partner',
      timestamps: true,
    },
  )
  return Partner
}
