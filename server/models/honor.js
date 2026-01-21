'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Honor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Honor.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      achievement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      awardDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      description: {
        type: DataTypes.TEXT,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          'https://res.cloudinary.com/darsm5kro/image/upload/v1756313824/zjyqvmkaiynr7tvyueeo.jpg',
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Honor',
      timestamps: true,
    },
  )
  return Honor
}
