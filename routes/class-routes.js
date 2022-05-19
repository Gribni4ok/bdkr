const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const {getClasses,getClassUpdateData, getClassForID, getStudentsForClassID} = require("../classes/classes.js");

router.get("/classes",async function(request,response){
    var data = await getClasses();
    response.render("classes/classes.hbs", {data: data});
});

router.post("/classes/class/update/get", async function(request,response){
    var data = await getClassUpdateData();
    console.log(data);
    response.send(JSON.stringify(data));
});

router.get("/classes/class/class/:id", async function(request,response){
    const id = request.params.id;
    var data = await getClassForID(id);
    var students = await getStudentsForClassID(id);
    response.render("classes/class.hbs", {class: data, students: students});
});

router.get("/classes/create", async function(request,response){
    response.render("classes/create.hbs");
});

module.exports = router;