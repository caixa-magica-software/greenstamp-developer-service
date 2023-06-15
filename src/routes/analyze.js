const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { doAnalysis } = require("../controllers/analyze");
const { calcRanking } = require("../controllers/calcRanking");
const { default: axios } = require("axios");

router.post("/", upload.single("binary"), async (req, res) => {
  const { appName, packageName, version, ranking } = req.body;

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

    console.log("Analyze");
    console.log(req.body);
    doAnalysis(req.file, {
      appName: app.name,
      packageName: app.package,
      version: app.file.vercode,
    })
      .then((result) => {
        let data = result.data;

        if (ranking == true) {
          calcRanking(result , ()=> {
            res.status(result.code).json({ data: data || null, error: null })
          })
  
          return;
        }

        res.status(result.code).json({ data: data || null, error: null })
      })
      .catch((error) =>
        res.status(error.code || 500).json({ data: null, error: error.message })
      );
    return;
  }

  console.log("Analyze");
  console.log(req.body);
  doAnalysis(req.file, req.body)
    .then((result) => {
      let data = result.data;

      if (ranking == true) {
        calcRanking(result , ()=> {
          res.status(result.code).json({ data: data || null, error: null })
        })

        return;
      }

      res.status(result.code).json({ data: data || null, error: null })
    })
    .catch((error) =>
      res.status(error.code || 500).json({ data: null, error: error.message })
    );
});

module.exports = router;
