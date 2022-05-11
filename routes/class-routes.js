const express = require("express");
const router = express.Router();

router.get("/classes",function(request,response){
    response.render("classes/classes.hbs");
});
module.exports = router;