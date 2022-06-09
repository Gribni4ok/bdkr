const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const {getTeachers,getTeacherForID,updateTeacherForID,createTeacher, createEducation, deleteTeacherForID, deleteEducationForID}= require("../classes/teachers.js");
const {verifyToken, checkIfAdmin, checkIfTeacher,fakeToken} = require("../classes/logins.js");

router.get("/teachers",verifyToken, async function(request,response){
    var data = await getTeachers();
    const title = "Список преподавателей";
    response.render("teachers/teachers.hbs", {teachers: data,title:title, token: request.fakeToken});
});

router.get("/teachers/teacher/teacher/:id",checkIfAdmin,verifyToken, async function(request,response){
    var data = await getTeacherForID(request.params.id);
    const title = data.data[0].teachersurname+ " " + data.data[0].teachername+ " " + data.data[0].teachermidname;
    response.render("teachers/teacher.hbs", {teacher: data.data[0], educations: data.educations,title:title, token: request.fakeToken});
});

router.get("/teachers/teacher/create",verifyToken,checkIfAdmin, async function(request,response){
    const title = "Новый учитель";
    response.render("teachers/create.hbs",{title:title, token: request.fakeToken});
});

router.post("/teachers/teacher/create",jsonParser ,async function(request,response){
    if(!request.body || !await createTeacher(request.body))response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/teachers/teacher/update/get", async function(request,response){
    var data = await getTeacherUpdateData();
    response.send(JSON.stringify(data));
});

router.post("/teachers/teacher/update", jsonParser, async function(request,response){
    if(!request.body || !await updateTeacherForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/teachers/education/create/:id",verifyToken,checkIfAdmin,async function(request,response){
    var data = await getTeacherForID(request.params.id);
    const title = "Новое образование";
    var fio = data.data[0].teachersurname + " " + data.data[0].teachername + " " + data.data[0].teachermidname;
    response.render("teachers/educations/create.hbs", {teacherfio: fio, teacherID: request.params.id,title:title, token: request.fakeToken});
});

router.post("/teachers/education/create", jsonParser, async function(request,response){
    if(!request.body || !await createEducation(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/teachers/teacher/delete/:id", async function(request, response){
    if(!await deleteTeacherForID(request.params.id)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/teachers/education/delete/:id", async function(request, response){
    if(!await deleteEducationForID(request.params.id)) response.sendStatus(400);
    else response.sendStatus(200);
});
module.exports = router;