const dao = require("../data/mysql/dao/result")

const { insert, getByApp } = require("../data/mysql/dao/result");
const ResultDTO = require("../dto/result");

exports.saveResult = (body) => {
  const { packageName, version, testName, testParameter, testResult, unit, timestamp } = body
  return new Promise((resolve, reject) => {
    if(packageName == null || packageName == "") reject({ code: 400, message: "package field cannot be null or empty" });
    else if(version == null || version == "") reject({ code: 400, message: "version field cannot be null or empty" });
    else if(testName == null || testName == "") reject({ code: 400, message: "testName field cannot be null or empty" });
    else if(testName == null || testName == "") reject({ code: 400, message: "testName field cannot be null or empty" });
    else if(testParameter == null || testParameter == "") reject({ code: 400, message: "testParameter field cannot be null or empty" });
    else if(testResult == null || testResult == "") reject({ code: 400, message: "testResult field cannot be null or empty" });
    else if(unit == null || unit == "") reject({ code: 400, message: "unit field cannot be null or empty" });
    else if(timestamp == null || timestamp == "") reject({ code: 400, message: "timestamp field cannot be null or empty" });
    else executeSaveResult(resolve, reject, body)
  });
}

const executeSaveResult = (resolve, reject, body) => {
  const dto = ResultDTO.fromAPI(body)
  return insert(dto)
    .then(result => resolve({ code: 201, data: result }))
    .catch(error => reject({ code: 500, message: error }))
}

exports.getResultsByApp = (body) => {
  const { packageName, version } = body
  return new Promise((resolve, reject) => {
    if(packageName == null || packageName == "") reject({ code: 400, message: "package field cannot be null or empty" });
    else if(version == null || version == "") reject({ code: 400, message: "version field cannot be null or empty" });
    else executeGetResultsByApp(resolve, reject, body)
  })
}

const executeGetResultsByApp = (resolve, reject, body) => {
  const dto = ResultDTO.fromAPI(body)
  return getByApp(dto)
    .then(result => resolve({ code: 200, data: result }))
    .catch(error => reject({ code: 500, message: error }))
}