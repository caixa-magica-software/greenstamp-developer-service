const express = require('express')
const router = express.Router()

const { updateResult } = require("../controllers/result")

router.put('/', (req, res) => {
  console.log("Recevied test results", req.body)
  updateResult(req.body)
    .then(result => res.status(result.code).json({ data: result.data || null, error: null }))
    .catch(error => res.status(error.code || 500).json({ data: null, error: error.message }))
})

module.exports = router