module.exports = class ResultDTO {

  constructor(packageName, version, testName, testParameter, testResult, unit, timestamp) {
    this.packageName = packageName
    this.version = version
    this.testName = testName
    this.testParameter = testParameter
    this.testResult = testResult
    this.unit = unit
    this.timestamp = timestamp
  }

  static fromAPI(body) {
    return new ResultDTO(
      body.packageName,
      body.version,
      body.testName,
      body.testParameter,
      body.testResult,
      body.unit,
      body.timestamp
    )
  }

}