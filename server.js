const express = require("express");
const geoip = require('geoip-lite');
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("products api running new deploy");
});

app.get("/geoip/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;
    const geo = geoip.lookup(ip);
    if (geo) {
      res.json({
        ip: ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        ll: geo.ll, // latitude and longitude
        timezone: geo.timezone || null,
      });
    } else {
      res.status(404).json({ error: "GeoIP information not found" });
    }
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong, please try again later." });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
