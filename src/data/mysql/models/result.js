const { Model, DataTypes } = require('sequelize')

module.exports = class Result extends Model {
  static init(sequelize) {
    super.init({
      package: DataTypes.STRING,
      version: DataTypes.STRING,
      testName: DataTypes.STRING,
      testParameter: DataTypes.STRING,
      testResult: DataTypes.STRING,
      unit: DataTypes.STRING,
      timestamp: DataTypes.DATE
    }, { 
      sequelize,
      tableName:"results"
    })
  }

  static fromDTO(dto) {
    return new Result({ 
      package: dto.packageName, 
      version: dto.version,
      testName: dto.testName,
      testParameter: dto.testParameter,
      testResult: dto.testResult,
      unit: dto.unit,
      timestamp: dto.timestamp
    })
  }

}