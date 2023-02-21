const Category = require('../models/category')
const AppCategories = require('../models/app-category')

exports.findOrCreate = async (categoryName) => {
  return new Promise((resolve, reject) => {
    Category.findOrCreate({ where: { name: categoryName } })
      .then(([category, _]) => resolve(category.name))
      .catch(error => reject(error))
  })
}

exports.getByApp = (package, version) => {
  return Promise ((resolve, reject) => {
    AppCategories.findAll({ where: { package: dto.packageName, version: dto.version } })
    .then(result => resolve(parseEntriesToResponse(result)))
    .catch(error => reject(error))
  })
}

const parseEntriesToResponse = (entries) => {
  return entries.map((entry) => entry.dataValues.category)
}