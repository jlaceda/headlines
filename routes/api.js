const express = require("express");
const router = express.Router();

const models = require("../models");

router.get("/articles", (req, res) => {
  models.Article.find({})
    .populate("comments")
    .then(articles => {
      res.send(articles);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("comment/:articleid", (req, res) => {
  const newComment = req.body;
  models.Comment.create(newComment)
    .then(comment => {
      return models.Article.findOneAndUpdate(
        { _id: req.params.articleid },
        { $push: { comments: comment._id } },
        { new: true }
      );
    })
    .then(article => {
      res.json(article);
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
