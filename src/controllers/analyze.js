const { getApplicationInfo } = require("./aptoide")
const { getResultsByApp } = require("./result")
const axios = require("axios")
const analyzers = require("../analyzers")()

exports.doAnalysis = (body) => {
  return new Promise((resolve, reject) => {
    const { packageName, version } = body
    if(packageName == null || packageName == "") reject({ code: 400, message: "packageName name cannot be null or empty" });
    else if(version != null && version == "") reject({ code: 400, message: "version name cannot be null or empty" });
    else execute(resolve, reject, body)
  });
}

const execute = (resolve, reject, body) => {
  //if(isForcingTest(body)) executeAnalysis(resolve, reject, body)
  getResultsByApp(body)
    .then(result => {
      if(result.code == 404 && !isForcingTest(body)) executeAnalysis(resolve, reject, body)
      else resolve(result)
    })
    .catch(error => reject(error))
}

// TODO send testing on then replacing console.log
const executeAnalysis = (resolve, reject, body) => {
  getApplicationInfo(body)
    .then(response => sendToAnalyzers(response.data))
    .then(() => resolve({ code: 200 }))
    .catch(error => reject(error))
}

const sendToAnalyzers = (storeInfo) => {
  analyzers.forEach(analyzer => {
    axios.post(analyzer.url, { ...storeInfo, tests: analyzer.tests })
  })
}

const isForcingTest = (body) => {
  return body.forceTest != null && body.forceTest == true
}
