const { getApplicationInfo } = require("./aptoide")
const { getResultsByApp } = require("./result")
const AnalyzeDTO = require("../dto/analyze")
const dao = require("../data/mysql/dao/result")

exports.doAnalysis = (body) => {
  return new Promise((resolve, reject) => {
    const { packageName, version } = body
    if(packageName == null || packageName == "") reject({ code: 400, message: "packageName name cannot be null or empty" });
    else if(version != null && version == "") reject({ code: 400, message: "version name cannot be null or empty" });
    else executeAnalysis(resolve, reject, body)
  });
}

const executeAnalysis = (resolve, reject, body) => {
  getResultsByApp(body)
    .then(result => resolve(result))
    .catch(error => reject(error))

  getApplicationInfo(body)
    .then(response => console.log("aptoide info", response))
    .catch(error => reject(error))
}
