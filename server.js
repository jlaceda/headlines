require("dotenv").config();
const express = require("express");

var app = express();
var PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("It Works!"));

app.listen(PORT, () => {
  console.log(
    `==> 🌎  Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
  );
});
