const Sequelize = require("sequelize")
const dbConfig = require("./config/config")

const connection = new Sequelize(dbConfig[process.env.NODE_ENV])

require("./models/result").init(connection)

module.exports = connection