const express = require("express");
const router = express.Router();

const { default: axios } = require("axios");

router.get("/", async (req, res) => {
  const apiUrl = req.url.replace('/get-api-aptoide/', '/7/getApp/');
  const fullUrl = `https://ws75.aptoide.com/${apiUrl}`;

  console.log("fullurl: " + fullUrl);
  try {
    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.body,
      headers: req.headers,
    });

    res.send(response.data);
    console.log("api Aptoide res : " + response.data)
  } catch (error) {
  const statusCode = error.response ? error.response.status : 500;
    console.log("api aptoide error: " + error)
    res.status(statusCode).send(error.message);
  }

});

module.exports = router;
