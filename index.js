require("dotenv").config();
const express = require('express');
const app = express();
const analyze = require('./routes/analyze')
const mongodb = require('./data/mongodb')

app.use(express.json())

app.use('/api/analyze', analyze)
app.get('/_/health', (req, res) => res.sendStatus(200));

app.listen(3000, () => {
    console.log(`Developer-Service is listening at ${3000}`);
});
