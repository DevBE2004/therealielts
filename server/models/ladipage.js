'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LadiPage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LadiPage.init(
    {
      type: DataTypes.STRING,
      url: DataTypes.STRING,
      content: { type: DataTypes.TEXT('long') },
    },
    {
      sequelize,
      modelName: 'LadiPage',
    },
  )
  return LadiPage
}
