'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Document.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Document.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      slug: { type: DataTypes.STRING, unique: true, allowNull: false },
      category: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      image: DataTypes.STRING,
      description: DataTypes.TEXT('long'),
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      type: { type: DataTypes.STRING, defaultValue: 'DOCUMENT' },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      metaData: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: 'Document',
      timestamps: true,
    },
  )
  return Document
}
