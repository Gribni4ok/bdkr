const express = require("express");
const router = express.Router();
const {getArticles,deleteArticleForID,createArticle, getArticleForID,updateArticleForID} = require("../classes/articles.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/articles",async function(request,response){
    var data = await getArticles();
    const title = "Домашня страница";
    response.render("articles/articles.hbs", {articles: data,title: title});
});

router.get("/articles/article/create", async function(request,response){
    const title = "Новая новость";
    response.render("articles/create.hbs",{title:title});
});

router.post("/articles/article/create",jsonParser ,async function(request,response){
    if(!request.body || !await createArticle(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/articles/article/delete/:id", async function(request,response){
    if(!await deleteArticleForID(request.params.id))response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/articles/article/article/:id", async function(request,response){
    var data = await getArticleForID(request.params.id);
    const title = data[0].articlename;
    console.log(data);
    response.render("articles/article.hbs",{article:data[0],title:title});
});

router.post("/articles/article/update",jsonParser ,async function(request,response){
    if(!request.body || !await updateArticleForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;