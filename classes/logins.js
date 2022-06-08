const pool = require("../js/init.js");
const bcrypt = require("bcrypt");
const {saltRounds} = require("../consts/values.js");

async function createAdmin(data){
    var result;
    const psw = bcrypt.hashSync(data.adminpassword, saltRounds);
    await pool.execute(`
    INSERT admins(adminemail, adminlogin, adminpassword)
    VALUE ("${data.adminemail}","${data.adminlogin}","${psw}")
    `)
    .then(()=>{
        result=true;
    })
    .catch((err)=>{
        console.log(err);
        result = false;
    })
    return result;
}
module.exports = {createAdmin};