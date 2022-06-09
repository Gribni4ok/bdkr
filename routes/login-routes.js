const express = require("express");
const router = express.Router();
const {createAdmin, findUser, genToken, checkIfNoAdmins} = require("../classes/logins.js");
var bodyParser = require('body-parser');
const res = require("express/lib/response");
var jsonParser = bodyParser.json();

router.get("/registration",checkIfNoAdmins, function(request,response){
    const title ="Регистрация"
    response.render("login/registration.hbs",{title:title, token: request.fakeToken});
});

router.post("/registration", jsonParser, async function(request,response){
    if(!request.body || !await createAdmin(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/authorization", function(request,response){
    const title ="Авторизация";
    response.render("login/authorization.hbs",{title:title, token: request.fakeToken});
});

router.post("/authorization", jsonParser, findUser, async function(request,response){
    const token = await genToken(request.user);
    response.json({token: token});
});


module.exports = router;