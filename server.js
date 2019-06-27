require("dotenv").config();
const express = require("express");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("It Works!"));

// only start express server after theres a connection to mongodb
mongoose.connect(
  // use uri from env when in production
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_DB_PROD_URI
    : "mongodb://localhost/headlines",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  err => {
    if (err !== null) {
      console.log(err);
      process.exit(1);
    }
    console.log("Successfully to connected to mongodb.");
    app.listen(PORT, () => {
      console.log(
        `==> 🌎  Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
      );
    });
  }
);
