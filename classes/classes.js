const async = require("hbs/lib/async");
const pool = require("../js/init.js");

async function getClasses(){
    var data = await pool.execute(`
    SELECT classes.classname, classes.classID, classes.classdate,
    courses.coursename
    FROM classes
    INNER JOIN courses
    ON classes.courseID = courses.courseID
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
};
async function getClassForID(id){
    var data = await pool.execute(`
    SELECT classes.classdesc, classes.classname, classes.classID, classes.classdate, 
    students.studentsurname, students.studentname, students.studentmidname, students.studentID,
    courses.courseID, courses.coursename,
    teachers.teachersurname, teachers.teachername, teachers.teachermidname, teachers.teacherID
    FROM classes
    INNER JOIN courses
    ON classes.courseID = courses.courseID
    INNER JOIN teachers
    ON classes.teacherID = teachers.teacherID
    INNER JOIN students
    ON classes.studentID = students.studentID
    WHERE classes.classID = "${id}"
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
};  
async function getStudentsForClassID(id){
    var data = await pool.execute(`
        SELECT studentID, studentsurname, studentname, studentmidname, studentsex, studentemail, studentphone
        FROM students
        WHERE classID = "${id}" 
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
}
async function getClassUpdateData(){
  let teachers = await pool.execute(`
  SELECT teachers.teacherID,teachers.teachersurname, teachers.teachername, teachers.teachermidname
  FROM teachers
  `)
  .catch(err=>{
    console.log(err);
  });

  let courses = await pool.execute(`
  SELECT courses.courseID,courses.coursename
  FROM courses
  `)
  .catch(err=>{
    console.log(err);
  });


  return {courses: courses[0], teachers: teachers[0]}
}
module.exports = {getClasses,getClassUpdateData ,getClassForID,getStudentsForClassID}