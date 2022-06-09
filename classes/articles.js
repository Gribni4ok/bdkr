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

async function deleteArticleForID(id){
    var result;
    await pool.execute(`
        DELETE 
        FROM articles
        WHERE articleID = "${id}"
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

async function createArticle(data){
    var result;
    var temp = new Date();
    var date = temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
    await pool.execute(`
        INSERT articles(articlename, articledesc, articledate)
        VALUES ("${data.name}","${data.description}","${date}")
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

async function updateArticleForID(data){
    var result;
      await pool.execute(`
      UPDATE articles
      SET 
          articledesc = "${data.description}",
          articlename = "${data.name}"
      WHERE articleID = "${data.ID}"
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

  async function getArticleForID(id){
    var data = await pool.execute(`
    SELECT *
    FROM articles
    WHERE articleID = "${id}"
    LIMIT 1
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
};  


module.exports = {getArticles,deleteArticleForID,createArticle,updateArticleForID, getArticleForID}