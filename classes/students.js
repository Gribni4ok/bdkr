const async = require("hbs/lib/async");
const pool = require("../js/init.js");

async function getStudents(){
    var data = await pool.execute(`
    SELECT students.studentID, students.studentsurname, students.studentname, students.studentmidname, students.studentsex, students.studentemail, students.studentphone, 
    classes.classname, classes.classID
    FROM students
    LEFT JOIN classes
    ON students.classID = classes.classID
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
}

async function getStudentForID(id){
    var data = await pool.execute(`
    SELECT *
    FROM students
    LEFT JOIN classes
    ON students.classID = classes.classID
    WHERE studentID = "${id}"
    LIMIT 1
    `)
    .catch(err=>{
        console.log(err);
    })
    return data[0];
}

async function getStudentUpdateData(){
    var data = await pool.execute(`
    SELECT classID, classname
    FROM classes
    `)
    .catch(err=>{
        console.log(err);
    })
    return {classes: data[0]};
}
async function UpdateStudentForID(data){
    await pool.execute(`
        UPDATE students
        SET classID = "${data.classID}",
        studentsurname = "${data.studentsurname}",
        studentname = "${data.studentname}",
        studentmidname = "${data.studentmidname}",
        studentsex = "${data.studentsex}",
        studentemail = "${data.studentemail}",
        studentphone = "${data.studentphone}",
        studenttin = "${data.studenttin}",
        studentpassport ="${data.studentpassport}",
        studentpassportby = "${data.studentpassportby}",
        studentpassportdate = "${data.studentpassportdate}"
        WHERE studentID = "${data.studentID}"
    `)
    .catch(err=>{
        console.log(err);
        return false;
    });
    return true;
}
async function CreateStudent(data){
    await pool.execute(`
  INSERT students(classID, studentsurname, studentname, studentmidname, studentlogin, studentpassword,
    studentsex, studentemail, studentphone, studenttin, studentpassport, studentpassportby, studentpassportdate)
  VALUES ("${data.classID}", "${data.studentsurname}", "${data.studentname}", "${data.studentmidname}", 
  "${data.studentlogin}", "${data.studentpassword}", "${data.studentsex}", "${data.studentemail}",
   "${data.studentphone}", "${data.studenttin}", "${data.studentpassport}", "${data.studentpassportby}",
    "${data.studentpassportdate}")
`)
.catch(err=>{
  console.log(err);
  return false;
});
return true;
}
module.exports = {getStudents, getStudentForID,getStudentUpdateData, UpdateStudentForID,CreateStudent};