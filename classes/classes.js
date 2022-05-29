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
    var info = await pool.execute(`
    SELECT classes.classdesc, classes.classname, classes.classID, classes.classdate, 
    courses.courseID, courses.coursename
    FROM classes
    INNER JOIN courses
    ON classes.courseID = courses.courseID
    WHERE classes.classID = "${id}"
    LIMIT 1
    `)
    .catch(err=>{
        console.log(err);
    });
    var student = await pool.execute(`
    SELECT students.studentsurname, students.studentname, students.studentmidname, students.studentID
    FROM classes
    INNER JOIN students
    ON classes.studentID = students.studentID
    WHERE classes.classID = "${id}"
    LIMIT 1
    `);
    var teacher = await pool.execute(`
    SELECT teachers.teachersurname, teachers.teachername, teachers.teachermidname, teachers.teacherID
    FROM classes
    INNER JOIN teachers
    ON classes.teacherID = teachers.teacherID
    WHERE classes.classID = "${id}"
    LIMIT 1
    `);
    return {info: info[0], student: student[0], teacher: teacher[0]};
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
async function UpdateClassForID(data){
    await pool.execute(`
    UPDATE classes
    SET studentID = "${data.studentID}",
        teacherID = "${data.teacherID}",
        classdate = "${data.classdate}",
        classdesc = "${data.description}",
        classname = "${data.classname}",
        courseID = "${data.courseID}"
    WHERE classID = "${data.classID}"
    LIMIT 1
  `)
  .then(()=>{
    return true;
 })
 .catch(err=>{
   console.log(err);
   return false;
 });
 return true;
}
async function createClass(data){
  console.log(data);
  await pool.execute(`
  INSERT classes(courseID, teacherID, classname, classdate, classdesc)
  VALUES ("${data.courseID}","${data.teacherID}","${data.classname}","${data.classdate}","${data.classdesc}")
`)
.catch(err=>{
  console.log(err);
  return false;
});
return true;
}
module.exports = {getClasses,getClassUpdateData ,getClassForID,getStudentsForClassID, UpdateClassForID, createClass}