const pool = require("../js/init.js");

async function getCourses(){
    var data = await pool.execute(`
        SELECT *
        FROM courses
    `)
    .catch((err)=>{
        console.log(err);
    })
    return data[0];
    }
    
    async function deleteCourseForID(id){
        var result;
        await pool.execute(`
            DELETE 
            FROM courses
            WHERE courseID = "${id}"
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
    
    async function createCourse(data){
        var result;
        await pool.execute(`
            INSERT courses(coursename, courseprice, coursetime,coursedesc)
            VALUES ("${data.name}","${data.price}","${data.time}","${data.description}")
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
    
    async function updateCourseForID(data){
        var result;
          await pool.execute(`
          UPDATE courses
          SET 
              coursedesc = "${data.description}",
              coursename = "${data.name}",
              coursetime = "${data.time}",
              courseprice = "${data.price}"
          WHERE courseID = "${data.ID}"
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
    
      async function getCourseForID(id){
        var data = await pool.execute(`
        SELECT *
        FROM courses
        WHERE courseID = "${id}"
        LIMIT 1
        `)
        .catch(err=>{
            console.log(err);
        });
        return data[0];
    };  
    
    
    module.exports = {getCourses,deleteCourseForID,createCourse,updateCourseForID, getCourseForID}