require("dotenv").config();
require("./data/mysql")
const express = require('express');
const app = express();

app.use(express.json())

app.get('/_/health', (req, res) => res.sendStatus(200));
app.use('/api/analyze', require('./routes/analyze'))
app.use('/api/result', require('./routes/result'))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Developer-Service is listening at ${process.env.PORT || 3000}`);
});
