const express = require("express");
const router = express.Router();
const {getClasses,getClassUpdateData, getClassForID, getStudentsForClassID, UpdateClassForID, createClass} = require("../classes/classes.js");
var bodyParser = require('body-parser');
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
    console.log(request.body);
    if(!request.body || !await UpdateClassForID(request.body))
    { 
        console.log("Плоха начальник");
        response.sendStatus(400);
    }
    else response.sendStatus(200);
});

router.get("/classes/class/class/:id", async function(request,response){
    const id = request.params.id;
    var data = await getClassForID(id);
    var students = await getStudentsForClassID(id);
    response.render("classes/class.hbs", {class: data, students: students});
});

router.get("/classes/create", async function(request,response){
    var data = await getClassUpdateData();
    response.render("classes/create.hbs", {data: data});
});

router.post("/class/create", jsonParser, async function(request,response){
    if(!request.body || !await createClass(request.body)) response.send(400);
    else response.send(200);
});

module.exports = router;