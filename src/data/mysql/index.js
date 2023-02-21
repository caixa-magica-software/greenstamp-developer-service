const Sequelize = require("sequelize")
const dbConfig = require("./config/config")
const path = require('path')
const recursiveReadSync = require('recursive-readdir-sync')
const connection = new Sequelize(dbConfig[process.env.NODE_ENV])

recursiveReadSync(path.join(path.normalize(__dirname), './models')).forEach(file => {
  require(file).init(connection)
})

/*
const Result = require("./models/result");
const Category = require("./models/category");

const AppsCategories = connection.define('AppsCategories', {}, { timestamps: false });

Result.belongsToMany(
  Category,
  { through: AppsCategories }
);



Category.belongsToMany(
  Result,
  { through: AppsCategories}
);
*/

module.exports = connection