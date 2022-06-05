const pool = require("../js/init.js");

  async function getLessonForID(id){
    let data = await pool.execute(`
    SELECT lessons.lessonID ,lessons.lessondateof, lessons.lessondesc,
    themes.themeID, themes.themename,
    teachers.teacherID, teachers.teachersurname, teachers.teachername, teachers.teachermidname,
    types.typeID, types.typename,
    audiences.audienceID, audiences.audiencename,
    formats.formatID, formats.formatname,
    timings.timingID, timings.timingbegin, timings.timingend
    FROM lessons 
    INNER JOIN themes
    ON lessons.themeID = themes.themeID
    INNER JOIN teachers
    ON lessons.teacherID = teachers.teacherID
    INNER JOIN types
    ON lessons.typeID = types.typeID
    INNER JOIN audiences
    ON lessons.audienceID = audiences.audienceID
    INNER JOIN formats
    ON lessons.formatID = formats.formatID
    INNER JOIN timings
    ON lessons.timingID = timings.timingID
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
  let timings= await pool.execute(`
  SELECT timings.timingID,timings.timingbegin, timings.timingend
  FROM timings
  `)
  .catch(err=>{
    console.log(err);
  });
  return {themes: themes[0], timings: timings[0], teachers: teachers[0], formats: formats[0], types: types[0], audiences: audiences[0]}
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
        timingID = "${data.timingID}"
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
        INSERT lessons(formatID, audienceID, timingID, typeID, teacherID, themeID, lessondateof, lessondesc)
        VALUES ("${data.formatID}","${data.audienceID}","${data.timingID}","${data.typeID}","${data.teacherID}","${data.themeID}","${data.lessondateof}","${data.description}")
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
module.exports = {getLessonForID, getLessonUpdateData, updateLessonForID, createLesson}