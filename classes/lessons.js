const pool = require("../js/init.js");
const months = require("../consts/values.js")

async function getLessonsForDate(year, month){
   let data = await pool.execute(`
   SELECT lessons.lessonid,lessons.lessondateof, themes.themename, timings.timingbegin, timings.timingend, audiences.audiencename
   FROM lessons
   INNER JOIN themes
   ON lessons.themeID = themes.themeID
   INNER JOIN timings
   ON lessons.timingID = timings.timingID
   INNER JOIN audiences
   ON lessons.audienceID = audiences.audienceID
   WHERE Month(lessons.lessondateof) = "${month}" AND Year(lessons.lessondateof) = "${year}"
   ORDER BY lessons.lessondateof,timings.timingbegin
 `)
  .catch(err=>{
     console.log(err);
 });
 if(data == null || data[0].length == 0){
   return getEmptyMonth(year,month-1);
 }
 return sortData(data[0]);
};

function getEmptyMonth(year,month){
  var arr =[];
  var date = new Date(year,month,1);
  if(date.getDay() != 1) arr = fillTillMonday(date);
  return arr.concat(fillWithEmptys(year,month));
};

function fillTillMonday(date){
  var arr = [];
  var tempDay = date.getDate();
  date.setDate(1);
  let day = date.getDay();
  if (day == 0) day = 7;
  for(let i = 0; i < day-1;i++){
    arr.push([{"lessondateof": ''}]);
  }
  date.setDate(tempDay);
  return arr;
};

function fillWithEmptys(year,month){
  var arr =[];
  for(let i = 1; i<=daysInMonth(month, year);i++){
    arr.push([{"lessondateof": i}]);
  }
  return arr;
};

function sortData(data){
var arr = [];
var secondarr = [];
console.log("SORTIMNG " + data[0].lessondateof)
var date = parseDate(data[0].lessondateof);
//Отсчёт от понедельника
arr = fillTillMonday(date);
//Добавляем дни без пар
for(let i = 1; i<date.getDate();i++){
   arr.push([{"lessondateof": i}]);
}
data.forEach(element => {
  parsedDate = parseDate(element.lessondateof)
    if(parsedDate > date)
    {
      arr.push(secondarr);
      let diff = parsedDate.getDate() - date.getDate();
      if(diff > 1)
      {
        for(let i = 1; i < diff;i++)
          arr.push([{"lessondateof": date.getDate()+i}]);
      }
      date = parsedDate;
      secondarr = [];
    }
  element.lessondateof = parsedDate.getDate();
  secondarr.push(element);
});
arr.push(secondarr);

let days = daysInMonth(date.getMonth(),date.getYear());
//Добавляем дни без пар
if(date.getDate() < days){
  for(let i = date.getDate()+1; i<=days;i++){
    arr.push([{"lessondateof": i}]);
  }
 }
return arr;
};

//Месяц от 0 до 11
function daysInMonth (month, year) {
 return new Date(year, month+1, 0).getDate();
};


function parseDate(dateTime){
 let dateTimeParts= dateTime.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
 dateTimeParts[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one
 var date = new Date(dateTimeParts[0],dateTimeParts[1],dateTimeParts[2]);
 return date; 
};

module.exports = {getLessonsForDate}