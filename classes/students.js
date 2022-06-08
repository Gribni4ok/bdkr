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
    var appendixes = await pool.execute(`
    SELECT *
    FROM appendixes
    WHERE studentID = "${id}"
    `)
    .catch(err=>{
        console.log(err);
    })
    return {data: data[0], appendixes: appendixes[0]};
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
async function updateStudentForID(data){
    var temp1 = "";
    var result;
    if(data.classID != '')
    { 
        temp1 = "classID = " + data.classID + ",";
    }  
    await pool.execute(`
        UPDATE students
        SET ${temp1}
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
    .then(()=>{
        result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    data.appendixes.forEach(async (appendix)=>{
        await pool.execute(`
            UPDATE appendixes
            SET
            appendixname = "${appendix.name}",
            appendixdesc = "${appendix.description}"
            WHERE appendixID = "${appendix.id}"
        `)
        .then(()=>{
            result =true;
        })
        .catch(err=>{
            console.log(err);
            result = false;
        });
    });
    return result;
}
async function createStudent(data){
    var temp1 = "";
    var temp2 = "";
    var result;
    if(data.classID != '')
    { 
        temp1 = "classID,";
        temp2 = data.classID + ",";
    }   
    await pool.execute(`
  INSERT students(${temp1} studentsurname, studentname, studentmidname, studentlogin, studentpassword,
    studentsex, studentemail, studentphone, studenttin, studentpassport, studentpassportby, studentpassportdate)
  VALUES (${temp2} "${data.studentsurname}", "${data.studentname}", "${data.studentmidname}", 
  "${data.studentlogin}", "${data.studentpassword}", "${data.studentsex}", "${data.studentemail}",
   "${data.studentphone}", "${data.studenttin}", "${data.studentpassport}", "${data.studentpassportby}",
    "${data.studentpassportdate}")
`)
.then(()=>{
    result =true;
})
.catch(err=>{
    console.log(err);
    result = false;
});
return result;
}

async function createAppendix(data){
    var result;
    await pool.execute(`
        INSERT appendixes(studentID, appendixname, appendixdesc)
        VALUES ("${data.studentID}","${data.name}","${data.description}")
    `)
    .then(()=>{
        result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    return result;
}

async function deleteStudentForID(id){
    var result;
    await pool.execute(`
        DELETE 
        FROM students
        WHERE studentID = "${id}"
    `)
    .then(()=>{
        result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    return result;
}

async function deleteAppendixForID(id){
    var result;
    await pool.execute(`
        DELETE 
        FROM appendixes
        WHERE appendixID = "${id}"
    `)
    .then(()=>{
        result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    return result;
}
module.exports = {getStudents, getStudentForID,getStudentUpdateData, updateStudentForID, createStudent, createAppendix,deleteStudentForID, deleteAppendixForID};