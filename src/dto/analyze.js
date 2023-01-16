module.exports = class AnalyzeDTO {

  constructor(appName, packageName, version) {
    this.appName = appName
    this.packageName = packageName
    this.version = version
  }

  static fromAPI(body) {
    return new AnalyzeDTO(
      body.appName,
      body.packageName,
      body.version
    )
  }

}