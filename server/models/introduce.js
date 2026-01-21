'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Introduce extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Introduce.init(
    {
      section1: DataTypes.JSON,
      images1: DataTypes.JSON,
      section2: DataTypes.JSON,
      images2: DataTypes.JSON,
      section3: DataTypes.JSON,
      images3: DataTypes.JSON,
      section4: DataTypes.JSON,
      images4: DataTypes.JSON,
      section5: DataTypes.JSON,
      images5: DataTypes.JSON,
      section6: DataTypes.JSON,
      images6: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'Introduce',
    },
  )
  return Introduce
}
