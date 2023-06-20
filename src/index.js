require("dotenv").config();
require("./data/mysql")
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json())
app.use(cors())

app.get('/_/health', (req, res) => res.sendStatus(200));
app.use('/api/analyze', require('./routes/analyze'))
app.use('/api/result', require('./routes/result'))
app.use('/api/get-all', require('./routes/get-all'))
// app.use('/api/get-all-formatted', require('./routes/get-all-formatted'))
app.use('/api/get-all-formatted-wcec', require('./routes/get-all-formatted-wcec'))
app.use('/api/get-all-formatted-kadabra', require('./routes/get-all-formatted-kadabra'))
app.use('/api/get-api-aptoide', require('./routes/get-api-aptoide'))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Developer-Service is listening at ${process.env.PORT || 3000}`);
});
