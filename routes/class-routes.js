const express = require("express");
const router = express.Router();
const {getClasses} = require("../classes/classes.js");

router.get("/classes",async function(request,response){
    var data = await getClasses();
    console.log(data);
    response.render("classes/classes.hbs", {data: data});
});

router.get("/classes/class/class/:id", async function(request,response){
    const id = request.params.id;
});

module.exports = router;