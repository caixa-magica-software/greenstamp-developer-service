const FormData = require('form-data')
const axios = require("axios")

const { getApplicationInfo } = require("./aptoide")
const { getResultsByApp } = require("./result")
const { insert } = require("../data/mysql/dao/result")
const analyzers = require("../analyzers")()
const ResultDTO = require("../dto/result")


exports.doAnalysis = (file, body) => {
  return new Promise((resolve, reject) => {
    const { appName, packageName, version } = body
    if(appName == null || appName == "") reject({ code: 400, message: "appName field cannot be null or empty" });
    else if(packageName == null || packageName == "") reject({ code: 400, message: "packageName field cannot be null or empty" });
    else if(version != null && version == "") reject({ code: 400, message: "version field cannot be null or empty" });
    else execute(resolve, reject, file, body)
  });
}

const execute = (resolve, reject, file, body) => {
  getResultsByApp(body)
    .then(result => {
      if(shouldAnalyze(result, body.forceTest)) {
        executeAnalysis(resolve, reject, result.code == 404, file, body)
      }
      else resolve(result)
    })
    .catch(error => reject(error))
}

const shouldAnalyze = (result, isForcing) => {
  if(result.code == 404) return true
  if(isForcing != null && isForcing == true) return true
  return false
}

const registerApp = (body, analyzers) => {
  analyzers.forEach(analyzer => {
    insert(ResultDTO.fromAPI({...body, timestamp: Date.now(), results: analyzer.tests}))
  })
}

const executeAnalysis = (resolve, reject, shouldRegister, file, body) => {
  getApplicationInfo(body)
    .then(response => {
      sendToAnalyzers(resolve, response.data, file, body, analyzers)
      if(shouldRegister) registerApp(body, analyzers)
    })
    .catch(error => {
      if(error.code == 404 && file != null) {
        sendToAnalyzers(resolve, {}, file, body, analyzers)
        if(shouldRegister) registerApp(body, analyzers)
      } else reject(error)
    })
}

const sendToAnalyzers = (resolve, storeInfo, file, appInfo, analyzers) => {
  analyzers.forEach(analyzer => {
    const data = new FormData()
    Object.keys(appInfo).forEach(key => { data.append(key, appInfo[key]) })
    if(storeInfo && storeInfo.url) data.append("url", storeInfo.url)
    if(storeInfo && storeInfo.metadata) data.append("metadata", storeInfo.metadata) 
    data.append("binary", JSON.stringify(file.buffer), file.originalname)
    axios.post(analyzer.url, data, { headers: data.getHeaders() })
  })
  resolve({ code: 200 })
} 

