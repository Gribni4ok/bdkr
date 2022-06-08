const pool = require("../js/init.js");

async function getArticles(){
var data = await pool.execute(`
    SELECT *
    FROM articles
`)
.catch((err)=>{
    console.log(err);
})
return data[0];
}

module.exports = {getArticles}