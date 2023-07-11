const { Model, DataTypes } = require('sequelize')

module.exports = class Result extends Model {
  static init(sequelize) {
    super.init({
      appName: DataTypes.STRING,
      package: DataTypes.STRING,
      version: DataTypes.STRING,
      testName: DataTypes.STRING,
      testParameter: DataTypes.STRING,
      testResult: DataTypes.STRING,
      unit: DataTypes.STRING,
      timestamp: DataTypes.DATE,
      optional: DataTypes.STRING,
      state: DataTypes.INTEGER,
      stars: DataTypes.STRING
    }, { 
      sequelize,
      tableName:"results"
    })
  }

  static fromDTO(dto) {
    return new Result({ 
      appName: dto.appName,
      package: dto.packageName, 
      version: dto.version,
      testName: dto.testName,
      testParameter: dto.testParameter,
      testResult: dto.testResult,
      unit: dto.unit,
      timestamp: dto.timestamp,
      optional: dto.optional,
      stars: dto.stars
    })
  }

}