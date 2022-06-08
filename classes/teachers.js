const pool = require("../js/init.js");

async function getTeachers(){
    var data = await pool.execute(`
    SELECT teachers.teacherID, teachers.teachersurname, teachers.teachername, teachers.teachermidname, teachers.teachersex, teachers.teacheremail, teachers.teacherphone
    FROM teachers
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
}

async function getTeacherForID(id){
    var data = await pool.execute(`
    SELECT *
    FROM teachers
    WHERE teacherID = "${id}"
    LIMIT 1
    `)
    .catch(err=>{
        console.log(err);
    })
    var educations = await pool.execute(`
    SELECT *
    FROM educations
    WHERE teacherID = "${id}"
    `)
    .catch(err=>{
        console.log(err);
    })
    return {data: data[0], educations: educations[0]};
}

async function updateTeacherForID(data){
    var result;
await pool.execute(`
    UPDATE teachers
    SET 
    teachersurname = "${data.teachersurname}",
    teachername = "${data.teachername}",
    teachermidname = "${data.teachermidname}",
    teachersex = "${data.teachersex}",
    teacheremail = "${data.teacheremail}",
    teacherphone = "${data.teacherphone}",
    teachertin = "${data.teachertin}",
    teacherpassport ="${data.teacherpassport}",
    teacherpassportby = "${data.teacherpassportby}",
    teacherpassportdate = "${data.teacherpassportdate}",
    teacherexperience = "${data.teacherexperience}",
    teachersalary = "${data.teachersalary}",
    teacheraddress = "${data.teacheraddress}"
    WHERE teacherID = "${data.teacherID}"
`)
.then(()=>{
    result =true;
})
.catch(err=>{
    console.log(err);
    result = false;
});

data.educations.forEach(async (education)=>{
    await pool.execute(`
        UPDATE educations
        SET
        educationbegindate = "${education.begindate}",
        educationenddate = "${education.enddate}",
        educationinstitution = "${education.institution}",
        educationqualification = "${education.qualification}",
        educationspeciality = "${education.speciality}",
        educationregnumber ="${education.regnumber}"
        WHERE educationID = "${education.id}"
    `)
    .catch(err=>{
        console.log(err);
        result = false;
    });
});
return result;
}

async function createTeacher(data){
    var result;
await pool.execute(`
    INSERT teachers(teachersurname, teachername, teachermidname, teacherlogin, teacherpassword, teachersalary, teacherexperience,
    teachersex, teacheremail, teacherphone, teachertin, teacherpassport, teacherpassportby, teacherpassportdate, teacheraddress)
    VALUES ("${data.teachersurname}", "${data.teachername}", "${data.teachermidname}", 
    "${data.teacherlogin}", "${data.teacherpassword}", "${data.teachersalary}", "${data.teacherexperience}", "${data.teachersex}", "${data.teacheremail}",
    "${data.teacherphone}", "${data.teachertin}", "${data.teacherpassport}", "${data.teacherpassportby}",
    "${data.teacherpassportdate}", "${data.teacheraddress}")
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

async function createEducation(data){
    var result;
    await pool.execute(`
        INSERT educations(teacherID, educationbegindate, educationenddate,educationinstitution, educationregnumber,educationspeciality,educationqualification)
        VALUES ("${data.teacherID}","${data.begindate}","${data.enddate}","${data.institution}","${data.regnumber}","${data.speciality}","${data.qualification}")
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

async function deleteTeacherForID(id){
    var result;
    await pool.execute(`
        DELETE 
        FROM teachers
        WHERE teacherID = "${id}"
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
async function deleteEducationForID(id){
    var result;
    await pool.execute(`
        DELETE 
        FROM educations
        WHERE educationID = "${id}"
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
module.exports = {getTeachers,getTeacherForID,updateTeacherForID,createTeacher,createEducation, deleteTeacherForID, deleteEducationForID};