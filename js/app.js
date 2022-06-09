const express = require("express");
const pool = require("./init.js");
const hbs = require('hbs');
const createTables = require("./create_tables.js");
const lessonRoutes = require("../routes/lesson-routes.js");
const classRoutes = require("../routes/class-routes.js");
const studentRoutes = require("../routes/student-routes.js");
const teacherRoutes = require("../routes/teacher-routes.js");
const articleRoutes = require("../routes/article-routes.js");
const loginRoutes = require("../routes/login-routes.js");
const coursesRoutes = require("../routes/course-routes.js");

createTables();

const app = express();

hbs.registerPartials('views/partials')

app.set("view engine", "hbs");

app.use(lessonRoutes);
app.use(classRoutes);
app.use(studentRoutes);
app.use(teacherRoutes);
app.use(articleRoutes);
app.use(loginRoutes);
app.use(coursesRoutes);

hbs.registerHelper('compareStrings', function(p, q, options) {
  return (p == q) ? options.fn(this) : options.inverse(this);
});
app.use(express.static('public'));

app.get("/list",function(_,response){
  response.render("list.hbs");
});

app.use("/home",function(_,response){
  const title = "Домашняя страница";
  response.render("home.hbs",{title});
});

app.listen(3000);

