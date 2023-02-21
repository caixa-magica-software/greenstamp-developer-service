const Result = require("../models/result")
const sequelize = require("../index")

exports.insert = (dto) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Result.bulkCreate(parseResultsEntriesToInsert(dto))
      const appsCategories = await AppCategories.bulkCreate(
        parseAppCategoriesEntriesToInsert(dto.packageName, dto.version, dto.categories)
      )
      resolve({...results, ...appsCategories})
    } catch (error) {
      reject(error)
    }
  })
}

const parseAppCategoriesEntriesToInsert = (package, version, categories) => {
  return categories.map(category => ({
    category, package, version
  }))
}

const parseResultsEntriesToInsert = (dto) => {
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
      Result.update({ ...test, state: 1 }, 
        { where: { package: dto.packageName, version: dto.version, testName: test.testName, testParameter: test.testParameter } })
        .then(result => resolve(result.dataValues))
        .catch(error => reject(error))
    })
  })
}

exports.getByApp = (dto) => {
  return new Promise((resolve, reject) => {
    sequelize.query(
      `select app_name, r.package, r.version, test_name, test_parameter, test_result, unit, optional, `
      + `category, timestamp from results r join apps_categories ac on r.package = ac.package and r.version = ac.version `
      + `where r.package = :package and r.version = :version`,
      { 
        model: Result,
        mapToModel: true,
        replacements: { package: dto.packageName, version: dto.version }, 
        type: sequelize.QueryTypes.SELECT 
      }
    )
    .then(result => resolve(parseEntriesToResponse(result)))
    .catch(error => reject(error))
  })
      
}

const parseEntriesToResponse = (entries) => {
  if(entries.length == 0) return {}
  const categories = []
  entries.forEach((result => {
    if(!categories.includes(result.dataValues.category)) categories.push(result.dataValues.category)
  }))
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
    categories: categories,
    results: results
  }  
}