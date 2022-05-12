const pool = require("../js/init.js");

async function getClasses(){
   var data = await pool.execute(`
        SELECT classID, classname
        FROM classes
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
};
module.exports = {getClasses}