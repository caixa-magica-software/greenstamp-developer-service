const Result = require("../models/result")

exports.insert = (dto) => {
  return new Promise((resolve, reject) => {
    Result.fromDTO(dto).save()
      .then(result => resolve(result.dataValues))
      .catch(error => reject(error))
  })
}

exports.getByApp = (dto) => {
  return new Promise((resolve, reject) => {
    Result.findAll({ where: { package: dto.packageName, version: dto.version } })
    .then(result => resolve(parseEntries(result)))
    .catch(error => console.log("error", error))
  })
      
}

const parseEntries = (entries) => {
  if(entries.length == 0) return {}
  const results = entries.map((result) => ({
    name: result.dataValues.testName,
    parameters: result.dataValues.testParameter,
    result: result.dataValues.testResult,
    unit: result.dataValues.unit
  }))
  return {
    appName: entries[0].dataValues.appName,
    packageName: entries[0].dataValues.package,
    version: entries[0].dataValues.version,
    timestamp: entries[0].dataValues.timestamp,
    results: results
  }  
}