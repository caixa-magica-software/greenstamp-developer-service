const axios = require("axios")
const AnalyzeDTO = require("../dto/analyze")

exports.getApplicationInfo = (body) => {
  const dto = AnalyzeDTO.fromAPI(body)
  return new Promise((resolve, reject) => {
    const params = { package_name: dto.packageName, vercode: dto.version }
    axios.get(`${process.env.APTOIDE_API_BASE_URL}/getApp`, { params: params})
      .then(response => resolve({code: 200, data: { ...parseApplicationInfoResponse(response.data.nodes.meta, resolve) }}))
      .catch(error => parseError(error, reject))
  })
}

exports.getApplicationCategory = (appId) => {
  return new Promise((resolve, reject) => {
    const params = { app_id: appId }
    axios.get(`${process.env.APTOIDE_API_BASE_URL}/apks/groups/get`, { params: params})
      .then(response => resolve({code: 200, data: parseCategoryResponse(response)}))
      .catch(error => parseError(error, reject))
  })
}

const parseError = (error, reject) => {
  const description = error.response.data.errors[0].description
  reject({ code: error.response.status, message: description})
}

const parseApplicationInfoResponse = (response) => ({
  id: response.data.id,
  url: response.data.file.path,
  metadata: response,
})

const parseCategoryResponse = (response) => {
  return response.data.datalist.list.map((category => ({
    id: category.id,
    name: category.name
  })))
}

/*
const parseApplicationInfoResponse = (response, resolve) => {
  resolve({
    code: 200,
    data: {
      url: response.data.file.path,
      metadata: response,
      categories: response.data.media.keywords
    }
  })
}
*/