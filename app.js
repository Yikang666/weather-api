const express = require("express");
const axios = require("axios");
const zlib = require("zlib");
const app = express();
const port = 3000;

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/", (req, res) => {
  res.send({ msg: "天气API服务正常" });
});

app.get("/api/*", async (req, res) => {
  try {
    const response = await axios.get(
      `https://i5.weather.oppomobile.com/${req.params[0]}`,
      {
        responseType: "arraybuffer",
      }
    );

    const buffer = Buffer.from(response.data, "binary");
    zlib.gunzip(buffer, (err, decompressedData) => {
      if (err) {
        return res.status(500).send({ msg: "数据解压失败" });
      }
      res.json(JSON.parse(decompressedData.toString()));
    });
  } catch (error) {
    res.status(500).send({ msg: "数据获取失败" });
  }
});

app.get("/location/*", async (req, res) => {
  try {
    const response = await axios.get(
      `https://location.apps.oppomobile.com/xlocations/v1/${req.params[0]}`,
      {
        responseType: "arraybuffer",
      }
    );

    const buffer = Buffer.from(response.data, "binary");
    zlib.gunzip(buffer, (err, decompressedData) => {
      if (err) {
        return res.status(500).send({ msg: "数据解压失败" });
      }
      res.json(JSON.parse(decompressedData.toString()));
    });
  } catch (error) {
    res.status(500).send({ msg: "数据获取失败" });
  }
});

app.get("/ip", async (req, res) => {
  try {
    const response = await axios.get(
      `https://ipvx.netart.cn/?ip=${req.ip}`
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ msg: "数据获取失败" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
