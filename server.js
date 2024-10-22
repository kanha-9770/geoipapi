const express = require("express");

const app = express();
const port =  8000;

app.get("/", (req, res) => {
  res.send("products api running new deploy");
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
