const pool = require("../js/init.js");

  async function getLessonForID(id){
    let data = await pool.execute(`
    SELECT lessons.lessonID ,lessons.lessondateof, lessons.lessondesc,
    themes.themeID, themes.themename,
    teachers.teacherID, teachers.teachersurname, teachers.teachername, teachers.teachermidname,
    types.typeID, types.typename,
    audiences.audienceID, audiences.audiencename,
    formats.formatID, formats.formatname,
    classes.classID,classes.classname,
    timings.timingID, timings.timingbegin, timings.timingend
    FROM lessons 
    LEFT JOIN themes
    ON lessons.themeID = themes.themeID
    LEFT JOIN teachers
    ON lessons.teacherID = teachers.teacherID
    LEFT JOIN types
    ON lessons.typeID = types.typeID
    LEFT JOIN audiences
    ON lessons.audienceID = audiences.audienceID
    LEFT JOIN formats
    ON lessons.formatID = formats.formatID
    LEFT JOIN timings
    ON lessons.timingID = timings.timingID
    LEFT JOIN classes
    ON lessons.classID = classes.classID
    WHERE lessonid ='${id}' 
    `)
    .catch(err=>{
      console.log(err);
    });
    if(data == null || data.length == 0) return null;
    return data[0];
  };

async function getLessonUpdateData(){
  let teachers = await pool.execute(`
  SELECT teachers.teacherID,teachers.teachersurname, teachers.teachername, teachers.teachermidname
  FROM teachers
  `)
  .catch(err=>{
    console.log(err);
  });
  let themes = await pool.execute(`
  SELECT themes.themeID,themes.themename
  FROM themes
  `)
  .catch(err=>{
    console.log(err);
  });
  let types = await pool.execute(`
  SELECT types.typeID,types.typename
  FROM types
  `)
  .catch(err=>{
    console.log(err);
  });
  let audiences = await pool.execute(`
  SELECT audiences.audienceID,audiences.audiencename
  FROM audiences
  `)
  .catch(err=>{
    console.log(err);
  });
  let formats = await pool.execute(`
  SELECT formats.formatID,formats.formatname
  FROM formats
  `)
  .catch(err=>{
    console.log(err);
  });
  let classes = await pool.execute(`
  SELECT classes.classID,classes.classname
  FROM classes
  `)
  .catch(err=>{
    console.log(err);
  });
  let timings= await pool.execute(`
  SELECT timings.timingID,timings.timingbegin, timings.timingend
  FROM timings
  `)
  .catch(err=>{
    console.log(err);
  });
  return {themes: themes[0],classes:classes[0], timings: timings[0], teachers: teachers[0], formats: formats[0], types: types[0], audiences: audiences[0]}
};

async function updateLessonForID(data){
  var result;
  await pool.execute(`
    UPDATE lessons
    SET lessondateof = "${data.lessondateof}",
        themeID = "${data.themeID}",
        typeID = "${data.typeID}",
        teacherID = "${data.teacherID}",
        formatID = "${data.formatID}",
        audienceID = "${data.audienceID}",
        lessondesc = "${data.description}",
        timingID = "${data.timingID}",
        classID = "${data.classID}"
    WHERE lessonID = "${data.lessonID}"
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

async function createLesson(data){
  var result;
    await pool.execute(`
        INSERT lessons(classID,formatID, audienceID, timingID, typeID, teacherID, themeID, lessondateof, lessondesc)
        VALUES ("${data.classID}","${data.formatID}","${data.audienceID}","${data.timingID}","${data.typeID}","${data.teacherID}","${data.themeID}","${data.lessondateof}","${data.description}")
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

async function deleteParameterForID(type,id){
  var result;
  await pool.execute(`
      DELETE 
      FROM ${type}s
      WHERE ${type}ID = "${id}"
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
async function editParameters(data){
  var result;
  if(data.createdata.audiences.length > 0)
    await pool.query(`
      INSERT INTO audiences(audiencename)
      VALUES ?`,[data.createdata.audiences])
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
  if(data.createdata.formats.length > 0)
    await pool.query(`
      INSERT INTO formats(formatname)
      VALUES ?`,[data.createdata.formats])
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
  if(data.createdata.types.length > 0)
    await pool.query(`
      INSERT INTO types(typename)
      VALUES ?`,[data.createdata.types])
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
  if(data.createdata.themes.length > 0)
    await pool.query(`
      INSERT INTO themes(themename)
      VALUES ?`,[data.createdata.themes])
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
  if(data.createdata.timings.length > 0)
    await pool.query(`
      INSERT INTO timings(timingbegin,timingend)
      VALUES ?`,[data.createdata.timings])
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });

  for(const element of data.editdata.audiences){
    await pool.execute(`
    UPDATE audiences
    SET audiencename = "${element[1]}"
    WHERE audienceID = "${element[0]}"`)
  .then(()=>{
    result =true;
  })
  .catch(err=>{
      console.log(err);
      result = false;
  });
  };
  
  
  for(const element of data.editdata.formats){
    await pool.execute(`
    UPDATE formats
    SET formatname = "${element[1]}"
    WHERE formatID = "${element[0]}"`)
  .then(()=>{
    result =true;
  })
  .catch(err=>{
      console.log(err);
      result = false;
  });
  };

  for(const element of data.editdata.types){
    await pool.execute(`
    UPDATE types
    SET typename = "${element[1]}"
    WHERE typeID = "${element[0]}"`)
  .then(()=>{
    result =true;
  })
  .catch(err=>{
      console.log(err);
      result = false;
  });
  };

  for(const element of data.editdata.themes){
    await pool.execute(`
    UPDATE themes
    SET themename = "${element[1]}"
    WHERE themeID = "${element[0]}"`)
  .then(()=>{
    result =true;
  })
  .catch(err=>{
      console.log(err);
      result = false;
  });
  };
  for(const element of data.editdata.timings){
    await pool.execute(`
    UPDATE timings
    SET timingbegin = "${element[1]}",
        timingend = "${element[2]}"
    WHERE timingID = "${element[0]}"`)
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
  };
  return result;
}
module.exports = {getLessonForID, getLessonUpdateData, updateLessonForID, createLesson,deleteParameterForID,editParameters}