const router = require('express').Router()
const multer = require('multer')
const upload = multer({  storage: multer.memoryStorage() })
const { doAnalysis } = require('../controllers/analyze')

router.post('/', upload.single("binary"), (req, res) => {
  console.log("Analyze");
  console.log(req.body);
  doAnalysis(req.file, req.body)
    .then(result => res.status(result.code).json({ data: result.data || null, error: null }))
    .catch(error => res.status(error.code || 500).json({ data: null, error: error.message }))
})

module.exports = router