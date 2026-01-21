'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Consultation.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      mobile: DataTypes.STRING,
      yearOfBirth: DataTypes.STRING,
      goal: DataTypes.STRING,
      difficult: DataTypes.STRING,
      schedule: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Consultation',
      timestamps: true,
    },
  )
  return Consultation
}
