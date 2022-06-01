const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const {getStudents, getStudentForID,getStudentUpdateData, UpdateStudentForID, CreateStudent} = require("../classes/students.js");
const req = require("express/lib/request");
const { json } = require("express/lib/response");

router.get("/students", async function(request,response){
    var data = await getStudents();
    response.render("students/students.hbs", {students: data});
});

router.get("/students/student/student/:id", async function(request,response){
    var data = await getStudentForID(request.params.id);
    response.render("students/student.hbs", {student: data[0]});
});

router.get("/students/student/create", async function(request,response){
    var data = await getStudentUpdateData();
    response.render("students/create.hbs",{classes:data.classes});
});

router.post("/students/student/create",jsonParser ,async function(request,response){
    if(!request.body || !await CreateStudent(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/students/student/update/get", async function(request,response){
    var data = await getStudentUpdateData();
    response.send(JSON.stringify(data));
});

router.post("/students/student/update", jsonParser, async function(request,response){
    сщт
    if(!request.body || !await UpdateStudentForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});
module.exports = router;