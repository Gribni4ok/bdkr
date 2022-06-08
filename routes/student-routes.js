const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const {getStudents, getStudentForID,getStudentUpdateData, updateStudentForID, createStudent, createAppendix, deleteStudentForID,deleteAppendixForID} = require("../classes/students.js");


router.get("/students", async function(request,response){
    var data = await getStudents();
    const title = "Список студентов";
    response.render("students/students.hbs", {students: data,title:title});
});

router.get("/students/student/student/:id", async function(request,response){
    var data = await getStudentForID(request.params.id);
    const title = data.data[0].studentsurname + " " + data.data[0].studentname + " " + data.data[0].studentmidname;
    response.render("students/student.hbs", {student: data.data[0], appendixes: data.appendixes,title:title});
});

router.get("/students/student/create", async function(request,response){
    var data = await getStudentUpdateData();
    const title = "Новый студент";
    response.render("students/create.hbs",{classes:data.classes,title:title});
});

router.post("/students/student/create",jsonParser ,async function(request,response){
    if(!request.body || !await createStudent(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/students/student/update/get", async function(request,response){
    var data = await getStudentUpdateData();
    response.send(JSON.stringify(data));
});

router.post("/students/student/update", jsonParser, async function(request,response){
    if(!request.body || !await updateStudentForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});


router.get("/students/appendix/create/:id",async function(request,response){
    var data = await getStudentForID(request.params.id);
    const title = "Новое приложение";
    var fio = data.data[0].studentsurname + " " + data.data[0].studentname + " " + data.data[0].studentmidname;
    response.render("students/appendixes/create.hbs", {studentfio: fio, studentID: request.params.id,title:title});
});

router.post("/students/appendix/create", jsonParser, async function(request,response){
    if(!request.body || !await createAppendix(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/students/student/delete/:id", async function(request,response){
    if(!await deleteStudentForID(request.params.id))response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/students/appendix/delete/:id", async function(request,response){
    if(!await deleteAppendixForID(request.params.id))response.sendStatus(400);
    else response.sendStatus(200);
});
module.exports = router;