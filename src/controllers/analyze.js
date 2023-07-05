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
  console.log("shouldAnalyze");
  console.log(isForcing);
  console.log("isForcing:" + (isForcing == true));
  if(result.code == 404) return true
  if(isForcing != null && isForcing == true) return true
  return false
}

const executeAnalysis = async (resolve, reject, shouldRegister, file, body) => {
  try {
    const appInfo = await getApplicationInfo(body)
    const categoriesInfo = await getApplicationCategory(appInfo.data.id)
    if(shouldRegister) registerApp(body, categoriesInfo.data, analyzers)
    sendToAnalyzers(resolve, body, {...appInfo, categories: categoriesInfo }, file, analyzers)
  } catch(error) {
    if(error.code == 404 && file != null) {
      if(shouldRegister) registerApp(body, [ { id: -1, name: 'not available' } ], analyzers)
      sendToAnalyzers(resolve, body, { data: {} }, file, analyzers)
    } else reject(error)
  }
}

const registerApp =  async (appInfo, categoriesInfo, analyzers) => {
  console.log("registerApp");
  const categories = await Promise.all(categoriesInfo.map(category => findOrCreateCategory(category.name).then(result => result)))
  analyzers.forEach(analyzer => {
    insertApp(ResultDTO.fromAPI({...appInfo, categories, timestamp: Date.now(), results: analyzer.tests}))
  })
}

const sendToAnalyzers = (resolve, appInfo, storeInfo, file, analyzers) => {
  if(file) {
    const form = new FormData()
    form.append('binary', file.buffer, { filename: file.originalname });
  }
  const results = [];
  const promises = [];
  analyzers.forEach(analyzer => {
    const form = new FormData()
    const app = { ...appInfo, ...storeInfo, tests: analyzer.tests }
    form.append("app", JSON.stringify(app))
    console.log("Asking analysis to ", analyzer.name)
    promises.push(
      axios.post(analyzer.url, form, { headers: form.getHeaders() }).then(response => {
        results.push(response);
      })
    )
  })
  Promise.all(promises).then(() => { // All the requests were successful
    // console.log('Results: '+ results);
    resolve({ code: 200 });
  })
  .catch((error) => { // At least one of the requests returned an error
    console.log("Received error from template: " + error);
    resolve({ code: 400 });
  });
} 

