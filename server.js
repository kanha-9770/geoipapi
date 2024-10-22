const express = require("express");
const geoip = require("geoip-country"); // Alternative package

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("products api running new deploy");
});

app.get("/geoip/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;

    // Basic IP validation (IPv4)
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipRegex.test(ip)) {
      return res.status(400).json({ error: "Invalid IP address format" });
    }

    // GeoIP lookup with error handling
    const geo = geoip.lookup(ip);

    if (geo) {
      return res.json({
        ip: ip,
        country: geo.country,
      });
    } else {
      console.error(`GeoIP lookup failed for IP: ${ip}`);
      return res.status(404).json({ error: "GeoIP information not found" });
    }
  } catch (err) {
    console.error(err); // Log error
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
