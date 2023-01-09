const path = require('path')
const recursiveReadSync = require('recursive-readdir-sync')
const contains = require('string-contains')

module.exports = getAnalyzersConfig = () => {
  const configs = []
  recursiveReadSync(path.join(path.normalize(__dirname), './')).forEach(file => {
    if (contains(file, '.config.json')) configs.push(require(file))
  })
  console.log(configs)
  return configs
}