const { Model, DataTypes } = require('sequelize')

module.exports = class AppCategories extends Model {
  static init(sequelize) {
    super.init({
      category: DataTypes.STRING,
      package: DataTypes.STRING,
      version: DataTypes.STRING
    }, { 
      sequelize,
      tableName:"apps_categories"
    })
  }
}