const Result = require("../models/result")

exports.insert = (dto) => {
  return new Promise((resolve, reject) => {
    Result.bulkCreate(parseEntriesToInsert(dto))
      .then(result => resolve(result.dataValues))
      .catch(error => reject(error))
  })
}

const parseEntriesToInsert = (dto) => {
  return dto.results.map(result => ({
    appName: dto.appName,
    package: dto.packageName,
    version: dto.version,
    testName: result.name,
    testParameter: result.parameters,
    testResult: result.result,
    unit: result.unit,
    timestamp: dto.timestamp,
    optional: dto.optional
  }))
}

exports.update = (dto) => {
  return new Promise((resolve, reject) => {
    const updt = parseEntriesToInsert(dto)
    updt.forEach(test => {
      console.log("updating")
      Result.update({ ...test, state: 1 }, 
        { where: { package: dto.packageName, version: dto.version, testName: test.testName, testParameter: test.testParameter } })
        .then(result => resolve(result.dataValues))
        .catch(error => reject(error))
    })
  })
}

exports.getByApp = (dto) => {
  return new Promise((resolve, reject) => {
    Result.findAll({ where: { package: dto.packageName, version: dto.version } })
    .then(result => resolve(parseEntriesToResponse(result)))
    .catch(error => reject(error))
  })
      
}

const parseEntriesToResponse = (entries) => {
  if(entries.length == 0) return {}
  const results = entries.map((result) => ({
    name: result.dataValues.testName,
    parameters: result.dataValues.testParameter,
    result: result.dataValues.testResult,
    unit: result.dataValues.unit,
    state: result.dataValues.state
  }))
  return {
    appName: entries[0].dataValues.appName,
    packageName: entries[0].dataValues.package,
    version: entries[0].dataValues.version,
    timestamp: entries[0].dataValues.timestamp,
    results: results
  }  
}