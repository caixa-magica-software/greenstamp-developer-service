const express = require("express");
const router = express.Router();

const { default: axios } = require("axios");

router.get("/", async (req, res) => {
  console.log("req.url: " + req.url);  
  const apiUrl = req.url.replace('/', '');
  const fullUrl = `https://ws75.aptoide.com/api/7/getApp${apiUrl}`;
  console.log("fullurl: " + fullUrl);
  try {
    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.body,
      headers: req.headers,
    });

    res.send(response.data);
    console.log("api res : " + response.data)
  } catch (error) {
  const statusCode = error.response ? error.response.status : 500;
    console.log("api error: " + error)
    res.status(statusCode).send(error.message);
  }

});

module.exports = router;
