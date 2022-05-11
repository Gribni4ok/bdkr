const pool = require("../js/init.js");

async function getClasses(){
   var data = await pool.execute(`
        SELECT classID, classname,
    `)
    .catch(err=>{
        console.log(err);
    });
};
module.exports = {getClasses}