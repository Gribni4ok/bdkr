const express = require("express");
const router = express.Router();
const {getClasses,getClassUpdateData, getClassForID, getStudentsForClassID, UpdateClassForID, createClass} = require("../classes/classes.js");
var bodyParser = require('body-parser');
const req = require("express/lib/request");
var jsonParser = bodyParser.json();

router.get("/classes",async function(request,response){
    var data = await getClasses();
    response.render("classes/classes.hbs", {data: data});
});

router.post("/classes/class/update/get", async function(request,response){
    var data = await getClassUpdateData();
    response.send(JSON.stringify(data));
});
router.post("/classes/class/update", jsonParser, async function(request,response){
    if(!request.body || !await UpdateClassForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/classes/class/class/:id", async function(request,response){
    const id = request.params.id;
    var data = await getClassForID(id);
    var students = await getStudentsForClassID(id);
    response.render("classes/class.hbs", {info: data.info[0], teacher: data.teacher[0], students: students});
});

router.get("/classes/create", async function(request,response){
    var data = await getClassUpdateData();
    response.render("classes/create.hbs", {data: data});
});

router.post("/classes/create", jsonParser, async function(request,response){
    if(!request.body || !await createClass(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;