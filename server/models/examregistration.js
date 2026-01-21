'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ExamRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExamRegistration.init(
    {
      name: DataTypes.STRING,
      mobile: DataTypes.STRING,
      email: DataTypes.STRING,
      organization: DataTypes.STRING,
      module: DataTypes.STRING,
      form: DataTypes.STRING,
      examDate: DataTypes.DATE,
      mailingAddress: DataTypes.STRING,
      promotionalProduct: DataTypes.STRING,
      passport: DataTypes.STRING,
      registrationObject: DataTypes.STRING,
      bill: DataTypes.STRING,
      isConfirmed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ExamRegistration',
      timestamps: true,
    },
  )
  return ExamRegistration
}
