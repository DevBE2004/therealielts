'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Teacher.init(
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
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          'https://res.cloudinary.com/darsm5kro/image/upload/v1756313824/zjyqvmkaiynr7tvyueeo.jpg',
      },
      bio: {
        type: DataTypes.TEXT,
      },
      education: {
        type: DataTypes.STRING,
      },
      ieltsScore: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
          max: 9,
        },
      },
      yearsOfExperience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      teachingStyle: {
        type: DataTypes.TEXT,
      },
      forWeb: {
        type: DataTypes.ENUM,
        values: ['LINGOSPEAK', 'THEREALIELTS', 'PTEBOOSTER'],
        defaultValue: 'THEREALIELTS',
      },
    },
    {
      sequelize,
      modelName: 'Teacher',
      timestamps: true,
    },
  )
  return Teacher
}
