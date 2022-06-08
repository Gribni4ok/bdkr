const express = require("express");
const router = express.Router();
const {createAdmin} = require("../classes/logins.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/registration", function(request,response){
    response.render("login/registration.hbs");
});

router.post("/registration", jsonParser, async function(request,response){
    if(!request.body || await createAdmin(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;