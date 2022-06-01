const pool = require("./init.js");

const request= [];

function createTables(){
  //0 Студент
    request[request.length] = `create table if not exists students(
        studentID smallint not null auto_increment,
        classID tinyint null,
        studentsurname nvarchar(30) not null,
        studentname nvarchar(30) not null,
        studentmidname nvarchar(30),
        studentlogin varchar(20) not null,
        studentpassword varchar(20) not null,
        studentsex nvarchar(15) not null,
        studentemail nvarchar(30) default 'Не указан',
        studentphone nvarchar(11) not null,
        studenttin nvarchar(12) unique not null,
        studentpassport nvarchar(10) not null,
        studentpassportby nvarchar(50) not null,
        studentpassportdate date not null,
        primary key(studentID),
        foreign key(classID) references classes(classID) ON DELETE SET NULL,
        CHECK((studentsurname != '') AND (studentname != '') AND (studentsex != '') 
        AND (studentphone != '') AND (studenttin != '') AND (studentpassport != '') 
        AND (studentlogin != '') AND (studentpassword != ''))
      )`;
      //1 Социальные льготы
      request[request.length] =`create table if not exists benefits(
        benefitID mediumint not null auto_increment,
        benefitname varchar(30) not null,
        benefitdate date not null,
        primary key(benefitID),
        CHECK(benefitname != '')
      )`;
      //2 Учитель
      request[request.length] =`create table if not exists teachers(
        teacherID tinyint not null auto_increment,
        teachersalary mediumint not null,
        teacherexperience tinyint default 0,
        teachersurname nvarchar(30) not null,
        teachername nvarchar(30) not null,
        teachermidname nvarchar(30),
        teacherlogin varchar(20) not null,
        teacherpassword varchar(20) not null,
        teachersex nvarchar(15) not null,
        teacherphone nvarchar(11) not null,
        teachertin nvarchar(12) not null,
        teacherpassport nvarchar(10) not null,
        teacherpassportby nvarchar(50) not null,
        teacherpassportdate date not null,
        teacheraddress nvarchar(50) not null,
        primary key(teacherID),
        CHECK((teachersurname != '') AND (teachername != '') AND (teachersex != '') 
        AND (teacherphone != '') AND (teachertin != '') AND (teacherpassport != '') 
        AND (teacherlogin != '') AND (teacherpassword != '')
        AND (teacheraddress !=''))
        )`;

        //3 Направления обучения
        request[request.length] = `create table if not exists courses(
          courseID tinyint not null auto_increment,
          coursename nvarchar(30) not null,
          courseprice mediumint not null,
          coursetime tinyint not null,
          primary key(courseID),
          CHECK (coursename != '')
          )`;

      //4 Образование учителей
      request[request.length] = `create table if not exists educations(
        educationID smallint not null auto_increment,
        teacherID tinyint,
        educationbegindate date not null,
        educationenddate date not null,
        educationinstitution nvarchar(50) not null,
        educationtype nvarchar(30),
        educationspeciality nvarchar(30),
        educationqualification nvarchar(30),
        primary key(educationID),
        foreign key(teacherID) references teachers(teacherID) on delete cascade,
        CHECK((educationinstitution != '') AND (educationtype != '')
        AND (educationspeciality !='') AND (educationqualification !=''))
        )`;
        
        //5 Связь преподавателей и направлений
        request[request.length] = `create table if not exists teacherstoeducations(
        teacherID tinyint,
        courseID tinyint,
        foreign key(teacherID) references teachers(teacherID) on delete cascade,
        foreign key(courseID) references courses(courseID) on delete cascade
        )`;

        //6 Студенческие группы
        request[request.length] = `create table if not exists classes(
        classID tinyint not null auto_increment,
        courseID tinyint,
        classname nvarchar(30) not null,
        classdate date not null,
        classdesc varchar(200) null,
        teacherID tinyint null,
        primary key(classID),
        foreign key(courseID) references courses(courseID) ON DELETE SET NULL,
        foreign key(teacherID) references teachers(teacherID) ON DELETE SET NULL,
        CHECK (classname != '')
        )`;
/*
        //7 Связь студентов и студенческих групп
        request[request.length] = `create table if not exists studentstoclasses(
        studentID smallint,
        classID tinyint,
        foreign key(studentID) references students(studentID) on delete cascade,
        foreign key(classID) references classes(classID) on delete cascade
        )`;
*/
        //8 Времена проведения занятий
        request[request.length] = `create table if not exists timings(
        timingID tinyint not null auto_increment,
        timingbegin time not null,
        timingend time not null,
        primary key(timingID)
        )`;
        
        //9 Аудитории
        request[request.length] = `create table if not exists audiences(
        audienceID smallint not null auto_increment,
        audiencename varchar(15),
        primary key(audienceID),
        CHECK (audiencename != '')
        )`;
        //10 Форматы занятий
        request[request.length] = `create table if not exists formats(
        formatID tinyint not null auto_increment,
        formatname varchar(20),
        primary key(formatID),
        CHECK (formatname != '')
        )`;
        //11 Типы занятий
        request[request.length] = `create table if not exists types(
        typeID tinyint not null auto_increment,
        typename varchar(30),
        primary key(typeID),
        CHECK (typename != '')
        )`;
        //12 Темы
        request[request.length] = `create table if not exists themes(
          themeID smallint not null auto_increment,
          themename varchar(30) not null,
          primary key(themeID),
          CHECK (themename != '')
          )`;
        //13 Занятия
        request[request.length] = `create table if not exists lessons(
        lessonID int not null auto_increment,
        formatID tinyint,
        audienceID smallint,
        timingID tinyint,
        typeID tinyint,
        teacherID tinyint,
        lessondateof date not null,
        lessondesc varchar(100) not null,
        themeID smallint,
        primary key(lessonID),
        foreign key(formatID) references formats(formatID) ON DELETE SET NULL,
        foreign key(audienceID) references audiences(audienceID) ON DELETE SET NULL,
        foreign key(timingID) references timings(timingID) ON DELETE SET NULL,
        foreign key(typeID) references types(typeID) ON DELETE SET NULL,
        foreign key(teacherID) references teachers(teacherID) ON DELETE SET NULL,
        foreign key(themeID) references themes(themeID) ON DELETE SET NULL,
        CHECK (lessondesc != '')
        )`;
        //14 Связь групп и занятий
        request[request.length] = `create table if not exists classestolessons(
          lessonID int,
          classID tinyint,
          foreign key(lessonID) references lessons(lessonID) on delete cascade,
          foreign key(classID) references classes(classID) on delete cascade
          )`;
        //15 Художественные принадлежности
        request[request.length] = `create table if not exists artsupplies(
        artsupplyID smallint not null auto_increment,
        artsupplyname nvarchar(30),
        primary key(artsupplyID),
        CHECK (artsupplyname != '')
        )`;
        //16 Связь занятий и художественных принадлежностей
        request[request.length] = `create table if not exists lessonstoartsupplies(
          artsupplyID smallint,
          lessonID int,
          foreign key(artsupplyID) references artsupplies(artsupplyID) on delete cascade,
          foreign key(lessonID) references lessons(lessonID) on delete cascade
          )`;
        // //16 Журнал оценок
        // request[request.length] = `create table if not exists grades(

        //   )`;
        //17 Статусы договора
        request[request.length] = `create table if not exists statuses(
        statusID tinyint not null auto_increment,
        statusname nvarchar(30),
        primary key(statusID),
        CHECK (statusname != '')
        )`;
        //18 Клиент
        request[request.length] = `create table if not exists clients(
        clientID int not null auto_increment,
        clientphone varchar(11) not null,
        clientemail varchar(30),
        clientportfolio varchar(100),
        clientsurname nvarchar(30) not null,
        clientname nvarchar(30) not null,
        clientmidname nvarchar(30),
        clienttin nvarchar(12) not null,
        clientpassport nvarchar(10) not null,
        clientpassportby nvarchar(50) not null,
        clientpassportdate date not null,
        primary key(clientID)
        )`;
        //19 Договоры на обучение
        request[request.length] = `create table if not exists contracts(
          contractID int not null auto_increment,
          contractdate date not null,
          courseID tinyint,
          clientID int,
          statusID tinyint,
          primary key(contractID),
          foreign key(statusID) references statuses(statusID),
          foreign key(clientID) references clients(clientID) on delete cascade,
          foreign key(courseID) references courses(courseID)
        )`;
      fill();
};

function fill(){
  for(let i = 0;i <request.length;i++)
  {
    pool.execute(request[i])
          .then(()=>{
            //console.log("Таблица номер " + i +" создана")
          })
          .catch(err=>{
            console.log("Ошибка в таблице под номером: "+i)
            console.log(err);
          });
      }
};

module.exports = createTables;