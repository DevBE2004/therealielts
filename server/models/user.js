'use strict'
const bcrypt = require('bcryptjs')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.hasMany(models.Comment, {
      //   foreignKey: 'authorId',
      //   as: 'comments',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // })
      User.hasMany(models.Document, {
        foreignKey: 'authorId',
        as: 'authors',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
      User.hasMany(models.Common, {
        foreignKey: 'authorId',
        as: 'authorsCommon',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      mobile: { type: DataTypes.STRING, allowNull: false, unique: true },
      occupation: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('password', bcrypt.hashSync(value, bcrypt.genSaltSync(10)))
        },
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          'https://res.cloudinary.com/darsm5kro/image/upload/v1756313824/zjyqvmkaiynr7tvyueeo.jpg',
      },
      role: {
        type: DataTypes.ENUM,
        values: ['EDITOR', 'ADMIN', 'USER'],
        defaultValue: 'USER',
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    },
  )
  return User
}
