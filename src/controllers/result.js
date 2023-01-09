const dao = require("../data/mysql/dao/result")

const { insert, getByApp } = require("../data/mysql/dao/result");
const ResultDTO = require("../dto/result");

exports.saveResult = (body) => {
  const { appName, packageName, version, results, timestamp, optional } = body
  return new Promise((resolve, reject) => {
    if(appName == null || appName == "") reject({ code: 400, message: "appName field cannot be null or empty" });
    else if(packageName == null || packageName == "") reject({ code: 400, message: "package field cannot be null or empty" });
    else if(version == null || version == "") reject({ code: 400, message: "version field cannot be null or empty" });
    else if(results == null || results.lenght == 0) reject({ code: 400, message: "results field cannot be null or empty" });
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
    .then(results => parseResults(resolve, results))
    .catch(error => reject({ code: 500, message: error }))
}

const parseResults = (resolve, results) => {
  if(Object.keys(results).length > 0) resolve({ code: 200, data: results })
  else resolve({ code: 404, data: results })
}