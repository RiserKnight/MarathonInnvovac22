
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const timeFunct = require(__dirname+"/Time.js");
const qFunct = require(__dirname+"/questionBank.js");
const {sequelize}=require('./models');
const multer = require("multer");
const path = require('path');
const formidable=require("formidable");
const fs=require("fs");
const { prependOnceListener, nextTick } = require("process");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios');
const { load } = require("nodemon/lib/config");
const _ = require('lodash');

require('dotenv').config();

const date = new Date();

const app = express();
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());
app.set('port', 4321);
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1*60*60*1000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use(async(req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    await dbFunct.updateLogged(userContent.userID,0);
      res.clearCookie('user_sid');        
  }
  next();
});

var userContent = {userID: 0,userName: ' ',userEmail:' ', status: false};

// middleware function to check for logged-in users
var sessionLogged = (req, res, next) => {
  console.log(req.originalUrl);
  if (req.session.user && req.cookies.user_sid) {
 
      res.redirect("/home");
  } else {
      next();
  }    
};
var sessionChecker = (req, res, next) => {
  console.log(req.originalUrl);
  if (req.session.user && req.cookies.user_sid) {
 
      next();
  } else {
      res.redirect("/login");
  }    
};
var sessionAdmin = (req, res, next) => {
  console.log(req.originalUrl);
  if (req.session.user && req.cookies.user_sid) {
    if(userContent.userID==205121002||userContent.userID==205121084||userContent.userID==205121106)
      next();
    else
    res.redirect("/home")
  } else {
      res.redirect("/login");
  }    
};
const randQ="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
let stage1Qlist=[1],stage2Qlist=[1];

/*
To get time in number use below code
const eventD = new Date(2022,3,19,17,25,0);
0-11 month

Remember to subtract 5 hours and 30 minutes

eventD.setMilliseconds(0);
console.log(eventD.getTime())*/

const Stage1upT=1651425900000;
const Stage1dwT=1654104300000;
const Stage2upT=1651425900000;
const Stage2dwT=1654104300000;
const Stage3upT=1651425900000;
const Stage3dwT=1654104300000;
const stage3Ques={q1:"false",q2:"false",q3:"false",q4:"false"};

app.get('/', (req, res) => {
  res.redirect("/home");
});

// route for user's dashboard
app.get('/home', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    
  userContent.status = true; 
  userContent.userID = req.session.user.userID; 
  userContent.userEmail = req.session.user.userEmail;
  userContent.userName = req.session.user.userName; 
  var hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour)
    console.log("Auto LogOut Time: -"+req.session.cookie.expires.toLocaleString('en-US', {timeZone: "Asia/Kolkata"}));
    console.log("User Session DashBoard "+JSON.stringify(req.session.user));
    res.render("home",{userID:userContent.userID,status:userContent.status});
  } else {
    res.render("home",{userID:userContent.userID,status:userContent.status});
  }
});

app.get("/stage1",sessionChecker,async(req,res)=>{
  const date = new Date();
  const userStage= await dbFunct.getUserCurrStage(userContent.userID);
  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT&&userStage===1){
  stage1Qlist = await qFunct.stage1Qlist();
  console.log("There should not be any space - _ between letters");
  const visit=await dbFunct.getIndex1(userContent.userID);
  if(visit.visit==0&&visit.index<13){
  await dbFunct.updateVisit1(userContent.userID,1);
  res.render("Stage1/stage");}
  else
  res.redirect("/stage1/ques");
  }
  else{
    const d = new Date();
    d.setTime(Stage1upT);
    const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    d.setTime(Stage1dwT);
    const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    res.render("EventTime",{up:up,dw:dw})
  }
  });

app.get("/stage1/ques",sessionChecker,async(req,res)=>{
  
  const userStage= await dbFunct.getUserCurrStage(userContent.userID);
  const date = new Date();
  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT&&userStage===1){
  const index= await dbFunct.getIndex1(userContent.userID);
  stage1Qlist[0]=index.index;
  const question = await dbFunct.getStage1Q(stage1Qlist[index.index]);
  if(index.index>12){
    await dbFunct.updateUserStage(userContent.userID,2);
    res.render("Stage1/end")
  }
  else{
    stage1Qlist[0]=stage1Qlist[0]+1;
    await dbFunct.updateIndex1(userContent.userID,stage1Qlist[0]);
  res.render("Stage1/stageQue",{sno:stage1Qlist[0]-1,question: question.question,qID: question.qID});
  }
  }
  });

  app.post("/stage1/ques/submit/:qID",async(req,res)=>{
   let ans=req.body.answer;
   ans= _.trim(ans, '_- ');
   ans = _.toLower(ans);
   console.log("Submit Answer: "+ans);
   const result=await dbFunct.checkStage1Q(req.params.qID,ans);
   let x=0; 
   if(result){x=10;}
   const curr = new Date();
   await dbFunct.storeSubmission(req.params.qID,userContent.userID,curr.getTime(),x,ans,1);
   console.log("Points: "+x);
   const prevP=await dbFunct.getUserPoints(userContent.userID);
   await dbFunct.updateUserPoints(userContent.userID,x+prevP);
   res.redirect("/stage1/ques");
});

app.get("/stage2",sessionChecker,async(req,res)=>{
  const userStage= await dbFunct.getUserCurrStage(userContent.userID);
  const date = new Date();
  if(date.getTime()>Stage2upT&&date.getTime()<Stage2dwT&&userStage===2){
  stage2Qlist = await qFunct.stage2Qlist();
  const visit=await dbFunct.getIndex2(userContent.userID);
  if(visit.visit==0&&visit.index<11){
  await dbFunct.updateVisit2(userContent.userID,1);
  res.render("Stage2/stage");}
  else
  res.redirect("/stage2/ques");
  }
  else{
    const d = new Date();
    d.setTime(Stage2upT);
    const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    d.setTime(Stage2dwT);
    const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    res.render("EventTime",{up:up,dw:dw})
  }
  });

app.get("/stage2/ques",sessionChecker,async(req,res)=>{
  const userStage= await dbFunct.getUserCurrStage(userContent.userID);
  const date = new Date();
  if(date.getTime()>Stage2upT&&date.getTime()<Stage2dwT&&userStage===2){
  const index= await dbFunct.getIndex2(userContent.userID);
  stage2Qlist[0]=index.index;
  const question = await dbFunct.getStage2Q(stage2Qlist[index.index]);
  if(index.index>10){
    await dbFunct.updateUserStage(userContent.userID,3);
    res.render("Stage1/end")
  }
  else{
    stage2Qlist[0]=stage2Qlist[0]+1;
    await dbFunct.updateIndex2(userContent.userID,stage2Qlist[0]);
  res.render("Stage2/stageQue",{question: question.question,qID: question.qID,
    option1: question.option1,option2: question.option2,option3: question.option3,option4: question.option4});
  }
  }
});

app.post("/stage2/ques/submit/:qID",async(req,res)=>{
console.log(req.body.user_ans);
const result=await dbFunct.checkStage2Q(req.params.qID,req.body.user_ans);
let x=0; 
if(result){x=15;}
const curr = new Date();
await dbFunct.storeSubmission(req.params.qID,userContent.userID,curr.getTime(),x,req.body.user_ans,2);
console.log("Points: "+x);
const prevP=await dbFunct.getUserPoints(userContent.userID);
await dbFunct.updateUserPoints(userContent.userID,x+prevP);
res.redirect("/stage2/ques");
});


    // route for user Login
    app.route("/login")
    .get(sessionLogged, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
    })
    .post((req, res) => {
       var userID = req.body.userID,
       password = req.body.password;
        //var userID=205121002,password="Innovac1998"
        const url ="https://main.pcc.events/centralized/"+userID+"/"+password;
  
      
      axios.post(url).then(async(response)=> {
        console.log(`statusCode: ${response.status}`);
        const Data = JSON.parse(response.data)
        console.log("User: "+userID+" Password: "+password+" Data: ");
        console.log(Data);
        if(Data.status){
          req.session.user={
            userID:Data.rollNo,
            userName:Data.userName,
            userEmail:Data.email,
            status:Data.status
          }
          userContent=req.session.user;
          const userNew=await dbFunct.getUser(userID);
          if(!userNew){
            console.log(await dbFunct.storeUser(userContent.userID,userContent.userName,0,1,1));
            console.log(await dbFunct.storeIndex1(userContent.userID,1,0));
            console.log(await dbFunct.storeIndex2(userContent.userID,1,0));
            res.redirect("/home");
          }
          else{
            if(userNew.loggedin==1)
            res.redirect("/logout")
            else{
            await dbFunct.updateLogged(userContent.userID,1);
            res.redirect("/home");
          }
        } 
        }
        else
        res.redirect("/login");
      })
      .catch(error => {
        console.error(error);
      });
  
    
  });

    // route for user logout
app.get('/logout', async(req, res) => {
  if (req.session.user && req.cookies.user_sid) {
  userContent.status = false; 
      res.clearCookie('user_sid');
      await dbFunct.updateLogged(userContent.userID,0);
      userContent = {userID: 0,userName: ' ',userEmail:' ', status: false};
      console.log(JSON.stringify(userContent)); 
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});

//File comparison

const folder='./uploads';

const output2="9924542";

const output1="57334278020"; 

const output3="19831478";

const output4="YESYESNO";

if(!fs.existsSync(folder))
{
  fs.mkdirSync(folder);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

var uploadMultiple = upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 2 }])


app.post('/uploadfile/:qID', uploadMultiple, function (req, res, next) {
  const qID=parseInt(req.params.qID);
  if(req.files){
    var v= req.files.file2[0].path;
        console.log(req.files);
        console.log(v+ 'file uploaded successfully'); 
    fs.readFile(v,async function(err,data){
      data=data.toString();
      var data1=data.replace(/(\r\n|\n|\r)/gm,"");
      let score=0;
      switch (qID) {
        case 0:
          await dbFunct.storeIndex3(userContent.userID,1,data1);
          stage3Ques.q1=true;
          if(output1==data1){
            score=80;
         }
          break;
        case 1:
          await dbFunct.storeIndex3(userContent.userID,2,data1);
          stage3Ques.q2=true;
          if(output2==data1){
            score=50;
         }
          break;
        case 2:
          await dbFunct.storeIndex3(userContent.userID,3,data1);
          stage3Ques.q3=true;
          if(output3==data1){
            score=60;
         }
          break;
        case 3:
          await dbFunct.storeIndex3(userContent.userID,4,data1);
          stage3Ques.q4=true;
          if(output4==data1){
            score=100;
         }
          break;
          default:
            console.log("Bekar");
            break;
        }    
        const prevP=await dbFunct.getUserPoints(userContent.userID);
        await dbFunct.updateUserPoints(userContent.userID,score+prevP);
        res.redirect("/stage3/que");
    })  
    }
  });

 

  app.get("/stage3",sessionChecker,async(req,res)=>{
  const date = new Date();
  const userStage= await dbFunct.getUserCurrStage(userContent.userID);
  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT&&userStage===3){
    res.sendFile(__dirname+"/views/Stage3/index1.html");
  }
  else{
    const d = new Date();
    d.setTime(Stage1upT);
    const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    d.setTime(Stage1dwT);
    const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    res.render("EventTime",{up:up,dw:dw})
  }
   
  });
  app.get("/stage3/que",sessionChecker,async(req,res)=>{
    const stage3index1= await dbFunct.getIndex3(userContent.userID,1);
     if(stage3index1)
     stage3Ques.q1=true;

     const stage3index2= await dbFunct.getIndex3(userContent.userID,2);
     if(stage3index2)
     stage3Ques.q2=true;

     const stage3index3= await dbFunct.getIndex3(userContent.userID,3);
     if(stage3index3)
     stage3Ques.q3=true;

     const stage3index4= await dbFunct.getIndex3(userContent.userID,4);
     if(stage3index4)
     stage3Ques.q4=true;
    res.render("Stage3/index2",stage3Ques);
  });

  app.get("/admin",sessionAdmin,(req,res)=>{
res.render("admin");
  });
  app.post("/admin/:btID",sessionAdmin,async(req,res)=>{
   btID=req.params.btID;
   if(btID==1)
   {
     const users= await dbFunct.getAllUsers();
     res.render("userTable",{users:users});
   }
   if(btID==2)
   {
     let questions=[];
     const questionsRaw= await dbFunct.getAllStage1Q();
     questionsRaw.forEach((question)=>{
     questions.push(question.dataValues);
     });
     res.render("stage1Table",{questions:questions});
   }
   if(btID==3)
   {
     let questions=[];
     const questionsRaw= await dbFunct.getAllStage2Q();
     questionsRaw.forEach((question)=>{
     questions.push(question.dataValues);
     });
     res.render("stage2Table",{questions:questions});
   }
   if(btID==4)
   {
     let submissions=[];
     const submissionsRaw= await dbFunct.getAllSubmission();
     submissionsRaw.forEach((question)=>{
      submissions.push(question.dataValues);
     });
     res.render("submissionTable",{submissions:submissions});
   }

   if(btID==5){
     const userID=parseInt(req.body.roll);
     const points=parseInt(req.body.points);
     await dbFunct.updateUserPoints(userID,points);
     const users= await dbFunct.getAllUsers();
     res.render("userTable",{users:users});
   }
   if(btID==6){
    const userID=parseInt(req.body.roll);
    const stage=parseInt(req.body.stage);
    await dbFunct.updateUserStage(userID,stage);
    const users= await dbFunct.getAllUsers();
    res.render("userTable",{users:users});
  }
  if(btID==7){
    const userID=parseInt(req.body.roll);
    const index=parseInt(req.body.index);
    const visit=parseInt(req.body.visit);
    await dbFunct.updateIndex1(userID,index);
    await dbFunct.updateVisit1(userID,visit);
    const users= await dbFunct.getUsersStage1();
    res.render("usersStageTable",{stage:"Stage 1",users:users});
  }
  if(btID==8)
   {
    const users= await dbFunct.getUsersStage1();
    res.render("usersStageTable",{stage:"Stage 1",users:users});
   }
   if(btID==9)
   {
     userID=req.body.roll;
     await dbFunct.updateUserPoints(userID,0);
     await dbFunct.updateUserStage(userID,1);
     await dbFunct.updateIndex1(userContent.userID,1);
    await dbFunct.updateVisit1(userContent.userID,0);
    const users= await dbFunct.getAllUsers();
    res.render("userTable",{users:users});
   }
   if(btID==10)
   {
     userID=req.body.roll;
     const submissions=await dbFunct.getAllIndex3(userID);
     res.render("stage3Table",{submissions:submissions});
   }
      });
    
app.get("/contact",(req,res)=>{
  res.sendFile(__dirname + '/views/contactus.html');
});

app.get("/leaderboard",async(req,res)=>{
const users = await dbFunct.getAllUsers();
res.render("leaderboard",{users:users});
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


app.listen(app.get('port'),async()=> {
  console.log(`Server started on port ${app.get('port')}`);
    await sequelize.authenticate();
    console.log("db connected");
   
    const quesS1 = await dbFunct.getStage1Q(1001);
    if(!quesS1){
     
    await dbFunct.storeStage1Q(1001," I'm your newsboy","server");
    await dbFunct.storeStage1Q(1002," what IT guys do on weekends." ,"diskdrive");
    await dbFunct.storeStage1Q(1003," Computer spectacles enhances what. " ,"websight");
    await dbFunct.storeStage1Q(1004," Twenty-five, but just eleven." ,"windows");
    await dbFunct.storeStage1Q(1005," Which is one of extraterrestrials' favorite places on a computer." ,"spacebar");
    await dbFunct.storeStage1Q(1006," what a computer does when it's worn out.","crashes");
    await dbFunct.storeStage1Q(1007,"what you call a nurse who processes the website", "urlogist");
    await dbFunct.storeStage1Q(1008," You can touch it while seeing different colors in me. You interact with me There is an app icon inside me. Who am ?", "gui");
    await dbFunct.storeStage1Q(1009,"I am a system of rule to convert information into another form ,but  you always messing with me by pushing and pulling me all the time. Don’t you have any manners? What am I?","code");
    await dbFunct.storeStage1Q(1010," I have no name, but I am given many. In biology i generate indentical copy of cell same as in  computer.who am I ?","clone");
    await dbFunct.storeStage1Q(1011, "Which data structure retains the same pronunciation, even after you left with one letter after removing four out of five?", "queue");
    await dbFunct.storeStage1Q(1012, "I am a informal  language for everything yet everyone tells me fake and artificial . Good luck trying to compile me. What am I?", "pseudocode");
    }
    
    const quesS2 = await dbFunct.getStage2Q(2001);
    if(!quesS2){
      await dbFunct.storeStage2Q(2001,"Where is the BIOS stored?", "Hard Disk", "RAM", "Flash Memory Chip", "Any of above", "option3");
      await dbFunct.storeStage2Q(2002, "Internet is","complex system", " decentralized system", "dynamic system", "All of above", "option4");
      await dbFunct.storeStage2Q(2003, "Use of Telnet","Remote login", "connecting to TV", "transferring files across net", "All of above", "option1");
      await dbFunct.storeStage2Q(2004, " Another name for LCD", "LED", "TFT", "CRT", "All of above", "option3");
      await dbFunct.storeStage2Q(2005, " Which of the following are the another names for a PEN Drive", "USBFlashDrive", "GigStick", "ThumbDrive", "All of the above", "option4");
      await dbFunct.storeStage2Q(2006, "Which of the following is the device that is constructed with the series of sensors that detects hand and finger motion? ", "Digitizers","Dataglove","joystick","Track ball","option2");
      await dbFunct.storeStage2Q(2007, "Blue Griffon is based on which rendering engine.","Webkit","Presto","Mecko", "Gecko","option4");
      await dbFunct.storeStage2Q(2008,"which is not the audio element’s attribute","controls","loop","Check","src","option3");
      await dbFunct.storeStage2Q(2009," Which language does not support polymorphism but supports classes","Ada","C++","Small talk","java","option1");
      await dbFunct.storeStage2Q(2010, "What shall we use in the case of safe downcast","Static cast","Dynamic Cast","Manual cast","Implicit Cast","option2");
      await dbFunct.storeStage2Q(2011,"Size of class is"," Sum of the size of all inherited variables along with the variables of the same class"," The size of the class is the largest size of the variable of the same class"," Classes in the programming languages do not have any size","Sum of the size of all the variables within a class.","option3");
      await dbFunct.storeStage2Q(2012, "Which of the following does not have body", "interface", "class", "abstract method", "none of the above", "option3");
      await dbFunct.storeStage2Q(2013, "Special software to create a job queue is called", "Linkage editor", "Interpreter", "Spooler", "Drive", "option3");
      await dbFunct.storeStage2Q(2014, "context switching is a part of ", "interrupt servicing","interrupt handling","polling","spooling", "option2");
      await dbFunct.storeStage2Q(2015, "The data blocks of a very large file in the Unix file system are allocated using", "contiguous allocation", "linked allocation", "indexed allocation", "an extension of indexed allocation", "option4");
      await dbFunct.storeStage2Q(2016, "swap space resides in", "RAM", "Disk", "ROM", "On-chip cache", "option2");
      await dbFunct.storeStage2Q(2017, " When R∩S=φ, then cost of computing R Natural Join S is ", "the same as R×S", "greater than R×S", "less than R×S", "can not say anything", "option1");
      await dbFunct.storeStage2Q(2018, "R (A,B,C,D) is a relation. Which of the following does not have a lossless join dependency preserving BCNF decomposition", "A->B,B->CD", "A->B,B->C,C->D", "AB->C,C->AD", "A->BCD", "option4");
      await dbFunct.storeStage2Q(2019, "If both the functional dependencies : X→Y and Y→X hold for two attributes X and Y then the relationship between X and Y is" , "M:N", "1:M", "1:M", "1:1", "option4");
      await dbFunct.storeStage2Q(2020, "In tuple relational calculus P1 AND P2 is equivalent to" , "(¬P1OR¬P2)", "¬(P1OR¬P2)", "¬(¬P1OR P2)", "¬(¬P1OR¬P2)", "option4");
      await dbFunct.storeStage2Q(2021, "Who suggested the name", "C++", "Rrick Mascitti","Steve Jobs","Ken Thompson","Dennis Ritchie", "option1");
      await dbFunct.storeStage2Q(2022, "From which programming language Classes and Objects concept derived for C++?", "Java", "Simula67", "Objective C", "Fortran","option2");
      await dbFunct.storeStage2Q(2023, "An set of rules that usually runs in polynomial time however probably returns inaccurate solutions is known as a", "Las Vegas Algorithm", " Monte Carlo Algorithm",  "Atlantic City Algorithm", "Approximation algorithm", "option2");
      await dbFunct.storeStage2Q(2024, "Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2025, "Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2026, "Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2027, "Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2028, "Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2029,"Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2030,"Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
 
    }
});
  