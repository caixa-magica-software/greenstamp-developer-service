module.exports = class ResultDTO {

  constructor(appName, packageName, version, testName, testParameter, testResult, unit, optional, timestamp) {
    this.appName = appName
    this.packageName = packageName
    this.version = version
    this.testName = testName
    this.testParameter = testParameter
    this.testResult = testResult
    this.unit = unit
    this.optional = optional
    this.timestamp = timestamp
  }

  static fromAPI(body) {
    return new ResultDTO(
      body.appName,
      body.packageName,
      body.version,
      body.testName,
      body.testParameter,
      body.testResult,
      body.unit,
      body.optional,
      body.timestamp
    )
  }

}