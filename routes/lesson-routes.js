const express = require("express");
const router = express.Router();
const {getLessonsForDate} = require("../classes/lessons.js");
const {getLessonForID, getLessonUpdateData, updateLessonForID,createLesson, deleteParameterForID, editParameters} = require("../classes/lesson.js");
const months = require("../consts/values.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/lessons/lessons/:id", async function(request,response){
  let dateTimeParts= request.params.id.split(/[- :]/);
  const title = "Учебный план";
  let year = dateTimeParts[0];
  let monthnumber = dateTimeParts[1];
  var data = await getLessonsForDate(year,monthnumber);
  let monthname = months[monthnumber-1];
  
  response.render("lessons/lessons.hbs",{lessons: data, month: monthname,monthnumber: monthnumber,year: year,title});
});

router.get("/lessons/create", async function(request,response){
    var data = await getLessonUpdateData();
    response.render("lessons/create.hbs", {dat: data});
});

router.post("/lessons/create", jsonParser,async function(request,response){
    if(!request.body ||!await createLesson(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/lessons/lesson/:id", async function(request,response){
  const id = request.params.id;
  const title = "Пара номер " + id;
  var data = await getLessonForID(id);
  let dateTimeParts = data[0].lessondateof.split(/[- :]/);
  let monthnumber = dateTimeParts[1];
  let monthname = months[monthnumber];
  let year = dateTimeParts[0];
  response.render("lessons/lesson.hbs", {lesson: data, month: monthname, monthnumber: monthnumber,year: year, title: title});
});

router.post("/lessons/lesson/update",jsonParser, async function(request,response){
    if(!request.body || !await updateLessonForID(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/lessons/lesson/update/get",jsonParser, async function(request,response){
    var data = await getLessonUpdateData();
    response.send(JSON.stringify(data));
});

router.get("/lessons/parameters/edit", async function(request,response){
    var data = await getLessonUpdateData();
    const title = "Параметры занятий";
    response.render("lessons/parameters/edit.hbs",{themes: data.themes, timings: data.timings, formats: data.formats, types: data.types, audiences: data.audiences, title: title});
});

router.post("/lessons/parameters/edit",jsonParser, async function(request,response){
    if(!request.body || ! await editParameters(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/lessons/parameters/delete/:id",jsonParser,async function(request,response){
  console.log(request.body);
      if(!request.body || !await deleteParameterForID(request.body.name,request.params.id)) response.sendStatus(400);
      else response.sendStatus(200);
});

module.exports = router;