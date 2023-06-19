const express = require("express");
const router = express.Router();
const url = require('url');

const { default: axios } = require("axios");

router.get("/", async (req, res) => {
  console.log("req.url: " + req.url);  
  const getApplicationInfo = (packageName) => {
    return new Promise((resolve, reject) => {
      const params = { package_name: packageName }
      axios.get(`${process.env.APTOIDE_API_BASE_URL}/getApp`, { params: params})
        .then(response => resolve({code: 200, data: response.data}))
        .catch(error => parseError(error, reject))
    })
  }

  try {
    const parsedUrl = url.parse(req.url, true);
    const packageName = parsedUrl.query.package_name;
    console.log(packageName)

    const appInfo = await getApplicationInfo(packageName)
    //console.log((JSON.stringify(appInfo)))
    return res.json(appInfo);
  } catch(error) {
    return res.status(401).json({error})
  }


});

module.exports = router;
