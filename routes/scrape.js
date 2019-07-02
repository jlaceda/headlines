const axios = require("axios");
const cheerio = require("cheerio");

const express = require("express");
const router = express.Router();

const models = require("../models");
const baseUrl = "https://www.apnews.com";

router.get("/", (_, res) => {
  axios
    .get(baseUrl + "/apf-topnews")
    .then(response => {
      const $ = cheerio.load(response.data);
      $(".FeedCard").each((_, el) => {
        const $el = $(el);
        const headline = $el
          .children(".CardHeadline")
          .children(".headline")
          .text();
        const contentElement = $el.children("a").filter((_, aTag) => {
          return $(aTag).attr("data-key") === "story-link";
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
          .then(article => {
            console.log(`Article added: ${article}`);
          })
          .catch(err => {
            console.log(err);
          });
      });
      res.status(200).send("Scrape Complete.");
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Scraping Error.");
    });
});

module.exports = router;
