module.exports = class ResultDTO {

  constructor(appName, packageName, version, results, timestamp, categories, optional) {
    this.appName = appName
    this.packageName = packageName
    this.version = version
    this.timestamp = timestamp
    this.results = results
    this.categories = categories
    this.optional = optional
  }

  static fromAPI(from) {
    return new ResultDTO(
      from.appName,
      from.packageName,
      from.version,
      from.results,
      from.timestamp,
      from.categories,
      from.optional,
    )
  }

}