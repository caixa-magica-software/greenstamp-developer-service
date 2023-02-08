require('dotenv').config();

module.exports = {
  development: {
    database: "developer-service-db",
    username: "root",
    password: "devpassword",
    host: "172.20.0.2",
    dialect: "mysql",
    define: {
      timestamps: false,
      underscored: true
    }
  },
  production: {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    host: process.env.DATABASE_URI,
    dialect: "mysql",
    define: {
      timestamps: false,
      underscored: true
    }
  }
}
