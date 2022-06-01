const express = require("express");
const pool = require("./init.js");
const hbs = require('hbs');
const createTables = require("./create_tables.js");
const lessonRoutes = require("../routes/lesson-routes.js");
const classRoutes = require("../routes/class-routes.js");
const studentRoutes = require("../routes/student-routes.js");

createTables();

const app = express();

hbs.registerPartials('views/partials')

app.set("view engine", "hbs");

app.use(lessonRoutes);
app.use(classRoutes);
app.use(studentRoutes);

hbs.registerHelper('compareStrings', function(p, q, options) {
  return (p == q) ? options.fn(this) : options.inverse(this);
});
app.use(express.static('public'));

app.get("/list",function(_,response){
  response.render("list.hbs");
});

app.get("/",function(_, response){
   pool.execute("SELECT * FROM logins")
   .then(result=>{
      response.render("list.hbs",{logins: result[0]});
      console.log(result[0]);
   })
   .catch(err=>{
     console.log(err);
   });
  });

  app.get("/control",function(request,response){
  response.render("control.hbs"); 
  });

  app.use("/home",function(_,response){
    const title = "Домашняя страница";
    response.render("home.hbs",{title});
  });

  const urlencodedParser = express.urlencoded({extended:false});

  app.post("/",urlencodedParser,function(request,response){
      if(!request.body) return response.sendStatus(400);
      console.log("В запросе содержатся данные: " + request.body.login);
  })

  const jsonParser = express.json()

  app.post("/control",jsonParser, function(request,response){
    console.log("АЛО");
    if(!request.body) return response.sendStatus(400);
    else console.log(request.body);
    
    
  });

app.listen(3000);

