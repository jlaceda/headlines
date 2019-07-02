const express = require("express");
const router = express.Router();

const models = require("../models");

router.get("/articles", (req, res) => {
  models.Article.find({})
    .then(articles => {
      res.send(articles);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
