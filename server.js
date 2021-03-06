require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use("/scrape", require("./routes/scrape"));
app.use("/api", require("./routes/api"));
app.use(express.static("public"));

// define mongodb connection
mongoose.connect(
  // use uri from env when in production
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_DB_PROD_URI
    : "mongodb://localhost/headlines",
  {
    // following lines are just to prevent deprecation warnings
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

const db = mongoose.connection;
db.on("error", err => {
  console.log(err);
  process.exit(1);
});

// only start express server after theres a connection to mongodb
db.once("open", () => {
  // we're connected!
  console.log("Successfully to connected to mongodb.");
  app.listen(PORT, () => {
    console.log(
      `==> 🌎  Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
    );
  });
});
