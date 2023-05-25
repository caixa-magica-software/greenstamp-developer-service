const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { doAnalysis } = require("../controllers/analyze");
const { default: axios } = require("axios");

router.post("/", upload.single("binary"), async (req, res) => {
  const { appName, packageName, version } = req.body;

  if (
    packageName != null &&
    packageName != "" &&
    (version == null || version == "") &&
    (appName == null || appName == "")
  ) {
    const info = await axios.get(
      process.env.APTOIDE_API_BASE_URL + "/getApp?package_name=" + packageName
    );
    const app = info.data.nodes.meta.data;
    doAnalysis(req.file, {
      appName: app.name,
      packageName: app.package,
      version: app.file.vercode,
    })
      .then((result) =>
        res.status(result.code).json({ data: result.data || null, error: null })
      )
      .catch((error) =>
        res.status(error.code || 500).json({ data: null, error: error.message })
      );
    return;
  }

  doAnalysis(req.file, req.body)
    .then((result) =>
      res.status(result.code).json({ data: result.data || null, error: null })
    )
    .catch((error) =>
      res.status(error.code || 500).json({ data: null, error: error.message })
    );
});

module.exports = router;
