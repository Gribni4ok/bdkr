const pool = require("../js/init.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {saltRounds, key} = require("../consts/values.js");

var fakeToken;

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


async function findUser(req,res,next){
    var user = {
        login: req.body.login,
        password: req.body.password
    }
    var found;
    if(found = await searchAdmins(user))
    {
        req.user = found;
        next();
    }
    else if(found = await searchTeachers(user))
    {
        req.user = found;
        next();
    }
    else if(found = await searchStudents(user))
    {
        req.user = found;
        next();
    }
    else{
        res.sendStatus(400);
    }
}

async function searchAdmins(user){
    var data = await pool.execute(`
    SELECT * 
    FROM admins
    WHERE adminlogin = "${user.login}" 
    LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    if(data[0][0] && bcrypt.compare(user.password, data[0][0].adminpassword))
    {
        var temp = {
            role:"2",
            login: data[0][0].adminlogin
        }
        fakeToken = temp;
        return temp;
    }
    else return false;
}
async function searchTeachers(user){
    var data = await pool.execute(`
    SELECT * 
    FROM teachers
    WHERE teacherlogin = "${user.login}" 
    LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    if(data[0][0] && bcrypt.compare(user.password, data[0][0].teacherpassword))
    {
        var temp = {
            role:"1",
            login: data[0][0].teacherlogin
        }
        fakeToken = temp;
        return temp;
    }
    else return false;
}
async function searchStudents(user){
    var data = await pool.execute(`
    SELECT * 
    FROM students
    WHERE studentlogin = "${user.login}" 
    LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    if(data[0][0] && bcrypt.compare(user.password, data[0][0].studentpassword))
    {
        var temp = {
            role:"0",
            login: data[0][0].studentlogin
        }
        fakeToken = temp;
        return temp;
    }
    else return false;
}

async function genToken(user){
    const token = jwt.sign({ role: user.role, login: user.login },key,{ expiresIn: "24h"});
    return token;
}

async function verifyToken(req,res,next){
    //const token = req.headers['token'];
    if(!fakeToken)
    {
        res.redirect("/authorization");
    }
    else
    {
        //req.user = jwt.verify(token,key);
        req.fakeToken = fakeToken;
        next();
    }
}

async function checkIfTeacher(req,res,next){
    //if(req.user.role >0) next();
    if(fakeToken.role >0) next();
    else res.redirect("/articles");
}

async function checkIfAdmin(req,res,next){
    //if(req.user.role >1) next();
    if(fakeToken.role >1) next();
    else res.redirect("/articles");
}

async function checkIfNoAdmins(req,res,next){
    var admins = await pool.execute(`
        SELECT *
        FROM admins
    `)
    .catch((err)=>{
        console.log(err);
    });
    if(!admins[0][0]) next();
    else res.redirect("/authorization");
}

module.exports = {createAdmin, findUser, genToken, verifyToken, checkIfAdmin, checkIfTeacher, checkIfNoAdmins};