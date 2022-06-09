const express = require("express");
const router = express.Router();
const {getCourses,deleteCourseForID,createCourse, getCourseForID,updateCourseForID} = require("../classes/courses.js");
const {verifyToken, checkIfAdmin, checkIfTeacher,fakeToken} = require("../classes/logins.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/courses",verifyToken,async function(request,response){
    var data = await getCourses();
    const title = "Направления обучения";
    response.render("courses/courses.hbs", {courses: data,title: title, token: request.fakeToken});
});

router.get("/courses/course/create",verifyToken,checkIfAdmin, async function(request,response){
    const title = "Новое направление";
    response.render("courses/create.hbs",{title:title, token: request.fakeToken});
});

router.post("/courses/course/create",jsonParser ,async function(request,response){
    if(!request.body || !await createCourse(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/courses/course/delete/:id", async function(request,response){
    if(!await deleteCourseForID(request.params.id))response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/courses/course/course/:id", verifyToken,checkIfAdmin,async function(request,response){
    var data = await getCourseForID(request.params.id);
    const title = data[0].coursename;
    response.render("courses/course.hbs",{course:data[0],title:title, token: request.fakeToken});
});

router.post("/courses/course/update",jsonParser ,async function(request,response){
    if(!request.body || !await updateCourseForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;