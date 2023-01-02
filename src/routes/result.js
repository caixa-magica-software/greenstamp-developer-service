const express = require('express')
const router = express.Router()

const { saveResult, getResults } = require("../controllers/result")

router.post('/', (req, res) => {
  saveResult(req.body)
    .then(result => res.status(result.code).json({ data: result.data, error: null }))
    .catch(error => res.status(error.code || 500).json({ data: null, error: error.message }))
})

module.exports = router