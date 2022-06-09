const express = require("express");
const router = express.Router();
const {getClasses,getClassUpdateData, getClassForID, getStudentsForClassID, UpdateClassForID, createClass,  deleteClassForID} = require("../classes/classes.js");
const {verifyToken, checkIfAdmin, checkIfTeacher} = require("../classes/logins.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/classes",verifyToken,checkIfTeacher,async function(request,response){
    var data = await getClasses();
    const title = "Учебные группы";
    response.render("classes/classes.hbs", {data: data,title: title, token: request.fakeToken});
});

router.post("/classes/class/update/get", async function(request,response){
    var data = await getClassUpdateData();
    response.send(JSON.stringify(data));
});
router.post("/classes/class/update", jsonParser, async function(request,response){
    if(!request.body || !await UpdateClassForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/classes/class/class/:id",verifyToken,checkIfTeacher, async function(request,response){
    const id = request.params.id;
    const title = "Группа номер " + id;
    var data = await getClassForID(id);
    var students = await getStudentsForClassID(id);
    response.render("classes/class.hbs", {info: data.info[0], teacher: data.teacher[0], students: students,title:title, token: request.fakeToken});
});

router.get("/classes/create",verifyToken,checkIfAdmin, async function(request,response){
    var data = await getClassUpdateData();
    const title = "Новая группа";
    response.render("classes/create.hbs", {data: data,title:title,token:request.fakeToken});
});

router.post("/classes/create", jsonParser, async function(request,response){
    if(!request.body || !await createClass(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/classes/class/delete/:id", async function(request,response){
    if(!await deleteClassForID(request.params.id)) response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;