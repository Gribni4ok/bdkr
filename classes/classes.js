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
    var teacher = await pool.execute(`
    SELECT teachers.teachersurname, teachers.teachername, teachers.teachermidname, teachers.teacherID
    FROM classes
    INNER JOIN teachers
    ON classes.teacherID = teachers.teacherID
    WHERE classes.classID = "${id}"
    LIMIT 1
    `);
    return {info: info[0], teacher: teacher[0]};
};  
async function getStudentsForClassID(id){
    var data = await pool.execute(`
        SELECT students.studentID, students.studentsurname, students.studentname, students.studentmidname, students.studentsex, students.studentemail, students.studentphone, 
        classes.classname, classes.classID
        FROM students
        INNER JOIN classes
        ON students.classID = classes.classID
        WHERE students.classID = "${id}" 
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
  if(!data.studentID || data.studentID == '') data.studentID = 0;
  if(!data.teacherID || data.teacherID == '') data.teacherID = 0;
    await pool.execute(`
    UPDATE classes
    SET teacherID = "${data.teacherID}",
        classdate = "${data.classdate}",
        classdesc = "${data.description}",
        classname = "${data.classname}",
        courseID = "${data.courseID}"
    WHERE classID = "${data.classID}"
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
  await pool.execute(`
  INSERT classes(courseID, teacherID, classname, classdate, classdesc)
  VALUES ("${data.courseID}","${data.teacherID}","${data.classname}","${data.classdate}","${data.description}")
`)
.catch(err=>{
  console.log(err);
  return false;
});
return true;
}
module.exports = {getClasses,getClassUpdateData ,getClassForID,getStudentsForClassID, UpdateClassForID, createClass}