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

router.put("/comment/:articleid", (req, res) => {
  console.log(req);
  const newComment = {
    author: req.body.author,
    body: req.body.body
  };
  console.log(newComment);
  models.Comment.create(newComment)
    .then(comment => {
      console.log(comment);
      return models.Article.findOneAndUpdate(
        { _id: req.params.articleid },
        { $push: { comments: comment._id } },
        { new: true }
      ).populate("comments");
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
