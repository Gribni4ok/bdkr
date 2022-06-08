const express = require("express");
const router = express.Router();
const {getArticles} = require("../classes/articles.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/articles",async function(request,response){
    var data = await getArticles();
    const title = "Домашня страница";
    response.render("articles/articles.hbs", {articles: data,title: title});
});

module.exports = router;