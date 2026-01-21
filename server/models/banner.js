'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      slug: { type: DataTypes.STRING, unique: true, allowNull: false },
      image: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      url: DataTypes.STRING,
      category: DataTypes.STRING,
      forWeb: {
        type: DataTypes.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        defaultValue: 'THEREALIELTS',
      },
    },
    {
      sequelize,
      modelName: 'Banner',
      timestamps: true,
    },
  )
  return Banner
}
