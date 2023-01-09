module.exports = class ResultDTO {

  constructor(appName, packageName, version, results, timestamp, optional) {
    this.appName = appName
    this.packageName = packageName
    this.version = version
    this.timestamp = timestamp
    this.results = results
    this.optional = optional
  }

  static fromAPI(body) {
    return new ResultDTO(
      body.appName,
      body.packageName,
      body.version,
      body.results,
      body.timestamp,
      body.optional,
    )
  }

}