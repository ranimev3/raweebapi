const express = require("express");
const cors = require("cors");
const animeRoutes = require("./routes/apiRoutes.js");
const mangaRoutes = require("./komikstation/routes/apiRoutes.js");

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to the Anime & Manga API",
  });
});

app.use("/api", animeRoutes);
app.use("/api/komikstation", mangaRoutes);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
