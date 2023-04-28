require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_URI,
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
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_URI,
    dialect: "mysql",
    define: {
      timestamps: false,
      underscored: true
    }
  }
}
