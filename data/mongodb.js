'use strict';

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URI, {
    dbName: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASS,
    useNewUrlParser: true
})
.then(_ => console.log('Connected to db url ', url))
.catch(err => console.log(err))

const mongodb = {
	schema: mongoose.Schema,
	model: function(name, schema) {
		return mongoose.model(name, schema);
	}
}

module.exports = mongodb;