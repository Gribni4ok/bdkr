const pool = require("./init.js");

const request= [];

function createTables(){

      //0 Учитель
      request[request.length] =`create table if not exists teachers(
        teacherID tinyint not null auto_increment,
        teachersalary mediumint not null,
        teacherexperience tinyint default 0,
        teachersurname nvarchar(30) not null,
        teachername nvarchar(30) not null,
        teachermidname nvarchar(30) null,
        teacherlogin varchar(20) not null unique,
        teacherpassword varchar(20) not null,
        teachersex nvarchar(15) not null,
        teacheremail nvarchar(30) not null,
        teacherphone nvarchar(11) not null,
        teachertin nvarchar(12) not null unique,
        teacherpassport nvarchar(10) not null unique,
        teacherpassportby nvarchar(50) not null,
        teacherpassportdate date not null,
        teacheraddress nvarchar(50) not null,
        primary key(teacherID)
        )`;

        //1 Направления обучения
      request[request.length] = `create table if not exists courses(
        courseID tinyint not null auto_increment,
        coursename nvarchar(30) not null,
        courseprice mediumint not null,
        coursetime tinyint not null,
        primary key(courseID)
        )`;

      //2 Образование учителей
      request[request.length] = `create table if not exists educations(
        educationID smallint not null auto_increment,
        teacherID tinyint not null,
        educationbegindate date not null,
        educationenddate date not null,
        educationinstitution nvarchar(50) not null,
        educationregnumber varchar(13) not null unique,
        educationspeciality nvarchar(30),
        educationqualification nvarchar(30),
        primary key(educationID),
        foreign key(teacherID) references teachers(teacherID) on delete cascade
        )`;
        
        //3 Связь преподавателей и направлений
      request[request.length] = `create table if not exists teacherstoeducations(
        teacherID tinyint,
        courseID tinyint,
        foreign key(teacherID) references teachers(teacherID) on delete cascade,
        foreign key(courseID) references courses(courseID) on delete cascade
        )`;

        //4 Студенческие группы
      request[request.length] = `create table if not exists classes(
        classID tinyint not null auto_increment,
        courseID tinyint,
        classname nvarchar(30) not null unique,
        classdate date not null,
        classdesc varchar(200) null,
        teacherID tinyint null,
        primary key(classID),
        foreign key(courseID) references courses(courseID) on delete set null,
        foreign key(teacherID) references teachers(teacherID) on delete set null
        )`;

        //5 Студент
      request[request.length] = `create table if not exists students(
        studentID smallint not null auto_increment,
        classID tinyint null,
        studentsurname nvarchar(30) not null,
        studentname nvarchar(30) not null,
        studentmidname nvarchar(30),
        studentlogin varchar(20) not null unique,
        studentpassword varchar(20) not null,
        studentsex nvarchar(15) not null,
        studentemail nvarchar(30) not null,
        studentphone nvarchar(11) not null,
        studenttin nvarchar(12) not null unique,
        studentpassport nvarchar(10) not null unique,
        studentpassportby nvarchar(50) not null,
        studentpassportdate date not null,
        primary key(studentID),
        foreign key(classID) references classes(classID) on delete set null
        )`;

      //6 Приложение
      request[request.length] =`create table if not exists appendixes(
        appendixID mediumint not null auto_increment,
        studentID smallint not null,
        appendixname varchar(30) not null,
        appendixdesc varchar(400) not null,
        primary key(appendixID),
        foreign key(studentID) references students(studentID) on delete cascade
        )`;

        //7 Времена проведения занятий
      request[request.length] = `create table if not exists timings(
        timingID tinyint not null auto_increment,
        timingbegin time not null,
        timingend time not null,
        primary key(timingID)
        )`;
        
        //8 Аудитории
      request[request.length] = `create table if not exists audiences(
        audienceID smallint not null auto_increment,
        audiencename varchar(15) not null,
        primary key(audienceID),
        CHECK (audiencename != '')
        )`;

        //9 Форматы занятий
      request[request.length] = `create table if not exists formats(
        formatID tinyint not null auto_increment,
        formatname varchar(20) not null,
        primary key(formatID)
        )`;

        //10 Типы занятий
      request[request.length] = `create table if not exists types(
        typeID tinyint not null auto_increment,
        typename varchar(30) not null,
        primary key(typeID)
        )`;

        //11 Темы
      request[request.length] = `create table if not exists themes(
        themeID smallint not null auto_increment,
        themename varchar(30) not null,
        primary key(themeID)
        )`;

        //12 Занятия
      request[request.length] = `create table if not exists lessons(
        lessonID int not null auto_increment,
        formatID tinyint,
        audienceID smallint,
        timingID tinyint,
        typeID tinyint,
        teacherID tinyint,
        classID tinyint,
        lessondateof date not null,
        lessondesc varchar(300) not null,
        themeID smallint,
        primary key(lessonID),
        foreign key(classID) references classes(classID) on delete cascade,
        foreign key(formatID) references formats(formatID) on delete set null,
        foreign key(audienceID) references audiences(audienceID) on delete set null,
        foreign key(timingID) references timings(timingID) on delete set null,
        foreign key(typeID) references types(typeID) on delete set null,
        foreign key(teacherID) references teachers(teacherID) on delete set null,
        foreign key(themeID) references themes(themeID) on delete set null
        )`;

        //13 Новости
        request[request.length] = `create table if not exists articles(
          articleID int not null auto_increment,
          articledate date not null,
          articlename varchar(50),
          articledesc varchar(1000),
          primary key(articleID)
          )`;

        //14 Админы
        request[request.length] = `create table if not exists admins(
          adminID tinyint not null auto_increment,
          adminemail varchar(30) not null unique,
          adminlogin varchar(20) not null unique,
          adminpassword varchar(100) not null,
          primary key(adminID)
          )`;
        /*
        // Связь групп и занятий
      request[request.length] = `create table if not exists classestolessons(
        lessonID int,
        classID tinyint,
        foreign key(lessonID) references lessons(lessonID) on delete cascade,
        foreign key(classID) references classes(classID) on delete cascade
        )`;
        */

        /*
        // Художественные принадлежности
        request[request.length] = `create table if not exists artsupplies(
        artsupplyID smallint not null auto_increment,
        artsupplyname nvarchar(30),
        primary key(artsupplyID),
        CHECK (artsupplyname != '')
        )`;
        

        // Связь занятий и художественных принадлежностей
        request[request.length] = `create table if not exists lessonstoartsupplies(
          artsupplyID smallint,
          lessonID int,
          foreign key(artsupplyID) references artsupplies(artsupplyID) on delete cascade,
          foreign key(lessonID) references lessons(lessonID) on delete cascade
          )`;
          */
        
      fill();
};

function fill(){
  for(let i = 0;i <request.length;i++)
  {
    pool.execute(request[i])
      .catch(err=>{
        console.log("Ошибка в таблице под номером: "+i)
        console.log(err);
      });
    }
};

module.exports = createTables;