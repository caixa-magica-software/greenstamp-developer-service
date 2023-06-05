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
    let app = {
      fetchError: false,
    };
    const info = await axios.get(
      process.env.APTOIDE_API_BASE_URL + "/getApp?package_name=" + packageName
    ).catch((error) => {
      res.status(500).json({ data: null, error: error.message })
      console.log("Error fetching '" + packageName + "': " + error.message)
      app.fetchError = true;
      return;
    });

    if (app.fetchError == true) return;

    app = info.data.nodes.meta.data;

    if (
      app.name == null || app.name == "" ||
      app.file.vercode == null || app.file.vercode == "" ||
      app.package == null || app.package == ""
    ) return;

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
