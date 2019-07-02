const models = require("../models");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const baseUrl = "https://www.apnews.com";

router.get("/", function(req, res) {
  axios.get(baseUrl + "/apf-topnews").then(function(response) {
    const $ = cheerio.load(response.data);
    $(".FeedCard").each(function(_, element) {
      const headline = $(element)
        .children(".CardHeadline")
        .children(".headline")
        .text();
      const contentElement = $(element)
        .children("a")
        .filter(function() {
          return $(this).attr("data-key") === "story-link";
        });
      const summary = contentElement
        .children(".content")
        .children("p")
        .text();
      const link = baseUrl + contentElement.attr("href");
      models.Article.create({
        headline: headline,
        summary: summary,
        link: link
      })
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(`Article added: ${dbArticle}`);
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

module.exports = router;
