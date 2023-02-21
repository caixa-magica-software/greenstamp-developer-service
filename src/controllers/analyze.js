const FormData = require('form-data')
const axios = require("axios")

const { getApplicationInfo, getApplicationCategory } = require("./aptoide")
const { getResultsByApp } = require("./result")
const { insert: insertApp } = require("../data/mysql/dao/result")
const { findOrCreate: findOrCreateCategory } = require("../data/mysql/dao/category")
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

const executeAnalysis = async (resolve, reject, shouldRegister, file, body) => {
  try {
    const appInfo = await getApplicationInfo(body)
    const categoriesInfo = await getApplicationCategory(appInfo.data.id)
    console.log(categoriesInfo)
    if(shouldRegister) registerApp(body, categoriesInfo.data, analyzers)
    //sendToAnalyzers(resolve, body, {...appInfo, categories: categoryInfo }, file, analyzers)
  } catch(error) {
    if(error.code == 404 && file != null) {
      if(shouldRegister) registerApp(body, analyzers)
      sendToAnalyzers(resolve, {}, file, body, analyzers)
    } else reject(error)
  }
}

const registerApp =  async (appInfo, categoriesInfo, analyzers) => {
  const categories = await Promise.all(categoriesInfo.map(category => findOrCreateCategory(category.name).then(result => result)))
  analyzers.forEach(analyzer => {
    insertApp(ResultDTO.fromAPI({...appInfo, categories, timestamp: Date.now(), results: analyzer.tests}))
      .then(result => console.log(result))
  })
}

const sendToAnalyzers = (resolve, appInfo, storeInfo, file, analyzers) => {
  analyzers.forEach(analyzer => {
    const form = new FormData()
    const app = { ...appInfo, ...storeInfo, tests: analyzer.tests }
    form.append("app", JSON.stringify(app))
    if(file) form.append("binary", JSON.stringify(file.buffer), file.originalname)
    axios.post(analyzer.url, form, { headers: form.getHeaders() })
  })
  resolve({ code: 200 })
} 

