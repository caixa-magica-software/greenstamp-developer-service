const axios = require("axios")
const AnalyzeDTO = require("../dto/analyze")

exports.getApplicationInfo = (body) => {
  const dto = AnalyzeDTO.fromAPI(body)

  return new Promise((resolve, reject) => {
    const params = { package_name: dto.packageName, vercode: dto.version }
    axios.get(`${process.env.APTOIDE_API_BASE_URL}/getApp`, { params: params})
      .then(response => parseResponse(response.data.nodes.meta, resolve))
      .catch(error => parseError(error, reject))
  })
}

const parseError = (error, callback) => {
  const description = error.response.data.errors[0].description
  callback({ code: error.response.status, message: description})
}

const parseResponse = (response, resolve) => {
  resolve({
    code: 200,
    data: {
      url: response.data.file.path,
      metadata: response,
    }
  })
}