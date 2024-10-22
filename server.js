const express = require("express");
const geoip = require("geoip-lite");

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("products api running new deploy");
});
// GeoIP lookup route with proper error handling
app.get("/geoip/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;

    // Basic IP validation (IPv4)
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipRegex.test(ip)) {
      return res.status(400).json({ error: "Invalid IP address format" });
    }

    // GeoIP lookup
    const geo = geoip.lookup(ip);

    if (geo) {
      return res.json({
        ip: ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        ll: geo.ll, // latitude and longitude
        timezone: geo.timezone || null,
      });
    } else {
      return res.status(404).json({ error: "GeoIP information not found" });
    }
  } catch (err) {
    // Pass error to global error handler
    next(err);
  }
});

// Health check route with error handling
app.get("/health", async (req, res, next) => {
  try {
    res.status(200).send("API is healthy");
  } catch (err) {
    next(err);
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong, please try again later." });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
