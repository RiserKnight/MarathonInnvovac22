
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
const { identity } = require("lodash");

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
app.set('port', 3000);
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1*60*60*1000*48
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});



// middleware function to check for logged-in users
var sessionLogged = async(req, res, next) => {
  console.log(req.originalUrl);
  if (req.session.user && req.cookies.user_sid) {
   // await dbFunct.updateLogged(req.session.user.userID,1);
   // req.session.user.status=true;
      res.redirect("/home");
  } else {
      next();
  }    
};
var sessionChecker = async(req, res, next) => {
  console.log(req.originalUrl);
  if (req.session.user && req.cookies.user_sid) {
   // await dbFunct.updateLogged(req.session.user.userID,1);
    //req.session.user.status=true;
      next();
  } else {
      res.redirect("/login");
  }    
};
var sessionAdmin = (req, res, next) => {
  console.log(req.originalUrl);
  
  if (req.session.user && req.cookies.user_sid) {
    const userID=req.session.user.userID;
    if(userID==205121002||userID==205121084||userID==205121106)
      next();
    else
    res.redirect("/home")
  } else {
      res.redirect("/login");
  }    
};


app.get('/',sessionChecker, (req, res) => {
  res.redirect("/home");
});

// route for user's dashboard
app.get('/home', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    const userID=req.session.user.userID;
    const status=req.session.user.status; 
    var hour = 3600000*48;
    req.session.cookie.expires = new Date(Date.now() + hour)
    console.log("Auto LogOut Time: "+req.session.cookie.expires.toLocaleString('en-US', {timeZone: "Asia/Kolkata"}));
    console.log("User Session DashBoard "+JSON.stringify(req.session.user));
    res.render("home",{userID:userID,status:status});
  } else {
    res.render("home",{userID:"",status:false});
  }
});

app.get("/stage1",sessionChecker,async(req,res)=>{
  const userID=req.session.user.userID;
  const userStage= await dbFunct.getUserCurrStage(userID);
  const Stage1upT=await dbFunct.getStageTimeStampS(3001);
  const Stage1dwT=await dbFunct.getStageTimeStampS(3002);
 
  const d = new Date();
  d.setTime(Stage1upT);
  const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  d.setTime(Stage1dwT);
  const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  
  console.log("Stage 1 Up Time: "+up);
  console.log("Stage 1 Down Time: "+dw);

  const date = new Date();
  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT){
  if(userStage===1){
  const visit=await dbFunct.getIndex1(userID);
  if(visit.visit==0&&visit.index<13){
  const stage1Qlist = await qFunct.stage1Qlist();
  await dbFunct.storeStage1QList(userID,JSON.stringify(stage1Qlist));
  await dbFunct.updateVisit1(userID,1);
  res.render("Stage1/stage");}
  else
  res.redirect("/stage1/ques");
  }
  else
  res.render("invalid");
  }
  else if(date.getTime()<Stage1upT)
  res.render("beforeTime",{up:Stage1upT,text:"Stage 1"})
  else
  res.render("afterTime");
  });

app.get("/stage1/ques",sessionChecker,async(req,res)=>{
  const userID=req.session.user.userID;
  const userStage= await dbFunct.getUserCurrStage(userID);
  const date = new Date();
  const Stage1upT=await dbFunct.getStageTimeStampS(3001);
  const Stage1dwT=await dbFunct.getStageTimeStampS(3002);

  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT&&userStage===1){
  const index= await dbFunct.getIndex1(userID);
  const stage1Qlist=JSON.parse(await dbFunct.getStage1QList(userID));
  const question = await dbFunct.getStage1Q(stage1Qlist[index.index]);
  if(index.index>12){
    await dbFunct.updateUserStage(userID,2);
    res.render("Stage1/end")
  }
  else{
    await dbFunct.updateIndex1(userID,index.index+1);
  res.render("Stage1/stageQue",{sno:index.index,question: question.question,qID: question.qID});
  }
  }
  });

  app.post("/stage1/ques/submit/:qID",sessionChecker,async(req,res)=>{
    const userID=req.session.user.userID;
   let ans=req.body.answer;
   ans= _.trim(ans, '_- ');
   ans = _.toLower(ans);
   console.log("Submit Answer: "+ans);
   const result=await dbFunct.checkStage1Q(req.params.qID,ans);
   let x=0; 
   if(result){x=15;}
   const curr = new Date();
   await dbFunct.storeSubmission(req.params.qID,userID,curr.getTime(),x,ans,1);
   console.log("Points: "+x);
   const prevP=await dbFunct.getUserPoints(userID);
   await dbFunct.updateUserPoints(userID,x+prevP);
   res.redirect("/stage1/ques");
});

app.get("/stage2",sessionChecker,async(req,res)=>{
  const userID=req.session.user.userID;
  const userStage= await dbFunct.getUserCurrStage(userID);
  const Stage2upT=await dbFunct.getStageTimeStampS(3003);
  const Stage2dwT=await dbFunct.getStageTimeStampS(3004);

  const d = new Date();
  d.setTime(Stage2upT);
  const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  d.setTime(Stage2dwT);
  const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  
  console.log("Stage 2 Up Time: "+up);
  console.log("Stage 2 Down Time: "+dw);

  const date = new Date();
  if(date.getTime()>Stage2upT&&date.getTime()<Stage2dwT){
  if(userStage===2){
  const visit=await dbFunct.getIndex2(userID);
  if(visit.visit==0&&visit.index<11){
  const stage2Qlist = await qFunct.stage2Qlist();
  await dbFunct.storeStage2QList(userID,JSON.stringify(stage2Qlist));
  await dbFunct.updateVisit2(userID,1);
  res.render("Stage2/Stage");}
  else
  res.redirect("/stage2/ques");
  }
  else
  res.render("invalid");
  }
  else if(date.getTime()<Stage2upT)
  res.render("beforeTime",{up:Stage2upT,text:"Stage 2"})
  else
  res.render("afterTime");
  });

app.get("/stage2/ques",sessionChecker,async(req,res)=>{
  const userID=req.session.user.userID;
  const userStage= await dbFunct.getUserCurrStage(userID);
  const date = new Date();
  const Stage2upT=await dbFunct.getStageTimeStampS(3003);
  const Stage2dwT=await dbFunct.getStageTimeStampS(3004);
  if(date.getTime()>Stage2upT&&date.getTime()<Stage2dwT&&userStage===2){
  const index= await dbFunct.getIndex2(userID);
  const stage2Qlist=JSON.parse(await dbFunct.getStage2QList(userID));
  const question = await dbFunct.getStage2Q(stage2Qlist[index.index]);
  if(index.index>10){
    await dbFunct.updateUserStage(userID,3);
    res.render("Stage2/end")
  }
  else{
    await dbFunct.updateIndex2(userID,index.index+1);
  res.render("Stage2/stageQue",{sno:index.index,question: question.question,qID: question.qID,
    option1: question.option1,option2: question.option2,option3: question.option3,option4: question.option4});
  }
  }
});

app.post("/stage2/ques/submit/:qID",sessionChecker,async(req,res)=>{
console.log(req.body.user_ans);
const userID=req.session.user.userID;
const result=await dbFunct.checkStage2Q(req.params.qID,req.body.user_ans);
let x=0; 
if(result){x=10;}
const curr = new Date();
await dbFunct.storeSubmission(req.params.qID,userID,curr.getTime(),x,req.body.user_ans,2);
console.log("Points: "+x);
const prevP=await dbFunct.getUserPoints(userID);
await dbFunct.updateUserPoints(userID,x+prevP);
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
          const userNew=await dbFunct.getUser(userID);
          if(!userNew){
            console.log(await dbFunct.storeUser(userID,Data.userName,0,1,1));
            console.log(await dbFunct.storeIndex1(userID,1,0));
            console.log(await dbFunct.storeIndex2(userID,1,0));
            res.redirect("/home");
          }
          else{
            if(userNew.loggedin===1&&userID!=205121002){
            console.log("yaha se logout");
            req.session.user={};
            res.clearCookie('user_sid');
            req.session.destroy((err) => {
            if (err) {
             return console.log(err);
             }
             res.redirect("/home");
  });}
            else{
              console.log("Ha yaha");
            await dbFunct.updateLogged(userID,1);
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
  console.log("/logout");
  if (req.session.user && req.cookies.user_sid) {
  await dbFunct.updateLogged(req.session.user.userID,0);
  req.session.user={};
  res.clearCookie('user_sid');
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/home");
  });
  
 
  } else {
      res.redirect('/login');
  }
});

//File comparison

const folder='./uploads';

const output2="9924542";

const output1="57334278020"; 

const output3="198114078";

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
  const userID=req.session.user.userID;
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
          await dbFunct.storeIndex3(userID,1,data1);
          if(output1==data1){
            score=80;
         }
          break;
        case 1:
          await dbFunct.storeIndex3(userID,2,data1);
          if(output2==data1){
            score=50;
         }
          break;
        case 2:
          await dbFunct.storeIndex3(userID,3,data1);
          if(output3==data1){
            score=60;
         }
          break;
        case 3:
          await dbFunct.storeIndex3(userID,4,data1);
          if(output4==data1){
            score=100;
         }
          break;
          default:
            console.log("Bekar");
            break;
        }    
        console.log(score);
        const prevP=await dbFunct.getUserPoints(userID);
        await dbFunct.updateUserPoints(userID,score+prevP);
        res.redirect("/stage3/que");
    })  
    }
  });

 

  app.get("/stage3",sessionChecker,async(req,res)=>{
  const userID=req.session.user.userID;
  const userStage= await dbFunct.getUserCurrStage(userID);
  const Stage3upT=await dbFunct.getStageTimeStampS(3005);
  const Stage3dwT=await dbFunct.getStageTimeStampS(3006);
  
  const d = new Date();
  d.setTime(Stage3upT);
  const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  d.setTime(Stage3dwT);
  const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  console.log("Stage 3 Up Time: "+up);
  console.log("Stage 3 Down Time: "+dw);


  const date = new Date();
  if(date.getTime()>Stage3upT&&date.getTime()<Stage3dwT&&userStage===3){
    res.sendFile(__dirname+"/views/Stage3/index1.html");
  }
  else if(date.getTime()<Stage3upT)
  res.render("beforeTime",{up:Stage3upT,text:"Stage 3"})
  else
  res.render("afterTime");
   
  });
  app.get("/stage3/que",sessionChecker,async(req,res)=>{
    const userID=req.session.user.userID;
    const userStage= await dbFunct.getUserCurrStage(userID);
    const Stage3upT=await dbFunct.getStageTimeStampS(3005);
    const Stage3dwT=await dbFunct.getStageTimeStampS(3006);

    const date = new Date();
    if(date.getTime()>Stage3upT&&date.getTime()<Stage3dwT&&userStage===3){
    const stage3Ques={q1:"false",q2:"false",q3:"false",q4:"false"};
    const stage3index1= await dbFunct.getIndex3(userID,1);
     if(stage3index1)
     stage3Ques.q1=true;

     const stage3index2= await dbFunct.getIndex3(userID,2);
     if(stage3index2)
     stage3Ques.q2=true;

     const stage3index3= await dbFunct.getIndex3(userID,3);
     if(stage3index3)
     stage3Ques.q3=true;

     const stage3index4= await dbFunct.getIndex3(userID,4);
     if(stage3index4)
     stage3Ques.q4=true;
    res.render("Stage3/index2",stage3Ques);
    }
  });

  app.get("/admin",sessionAdmin,(req,res)=>{
res.render("admin");
  });
  app.post("/admin/:btID",sessionAdmin,async(req,res)=>{
   btID=parseInt(req.params.btID);
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
     userID=parseInt(req.body.roll);
     await dbFunct.updateUserPoints(userID,0);
     await dbFunct.updateUserStage(userID,1);
     await dbFunct.updateIndex1(userID,1);
    await dbFunct.updateVisit1(userID,0);
    await dbFunct.updateIndex2(userID,1);
    await dbFunct.updateVisit2(userID,0);
    await dbFunct.delStage2QList(userID);
    await dbFunct.delStage3Submission(userID);
    const users= await dbFunct.getAllUsers();
    res.render("userTable",{users:users});
   }
   if(btID==10)
   {
     userID=parseInt(req.body.roll);
     const submissions=await dbFunct.getAllIndex3(userID);
     res.render("stage3Table",{submissions:submissions});
   }
   if(btID==11)
   {
    const users= await dbFunct.getUsersStage2();
    res.render("usersStageTable",{stage:"Stage 2",users:users});
   }
   if(btID==12){
    const userID=parseInt(req.body.roll);
    const index=parseInt(req.body.index);
    const visit=parseInt(req.body.visit);
    await dbFunct.updateIndex2(userID,index);
    await dbFunct.updateVisit2(userID,visit);
    const users= await dbFunct.getUsersStage2();
    res.render("usersStageTable",{stage:"Stage 2",users:users});
  }
  if(btID==13)
   {
     userID=parseInt(req.body.roll);
     await dbFunct.updateLogged(userID,0);
     const users= await dbFunct.getAllUsers();
     res.render("userTable",{users:users});
   }
   if(btID==14)
   {
     let submissions=[];
     qID=parseInt(req.body.qID);
     const submissionsRaw= await dbFunct.getAllSubmissionQ(qID);
     submissionsRaw.forEach((question)=>{
      submissions.push(question.dataValues);
     });
     res.render("submissionTable",{submissions:submissions});
   }
   if(btID==15)
   {
    const timings=await dbFunct.getStageTimeStamp();
    const d = new Date();
    const curr=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    res.render("timings",{timings:timings,curr:curr});
   }
   if(btID==16)
   {
    const timeID=parseInt(req.body.timeID);
    const timeStamp=parseInt(req.body.timeStamp); 
    await dbFunct.updateStageTimeStamp(timeID,timeStamp);
    const timings=await dbFunct.getStageTimeStamp();
    const d = new Date();
    const curr=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
    res.render("timings",{timings:timings,curr:curr});
   }
   if(btID==17)
   {
    const userID=parseInt(req.body.userID);
    const points=parseInt(req.body.points); 
    const prevP=await dbFunct.getUserPoints(userID);
    await dbFunct.updateUserPoints(userID,prevP-points);
    const users= await dbFunct.getAllUsers();
    res.render("userTable",{users:users});
   }
   if(btID==18)
   {
    const userID=parseInt(req.body.userID);
    const points=parseInt(req.body.points);  
    const prevP=await dbFunct.getUserPoints(userID);
    await dbFunct.updateUserPoints(userID,prevP+points);
    const users= await dbFunct.getAllUsers();
    res.render("userTable",{users:users});
 

   }
      });
    
app.get("/contact",(req,res)=>{
  res.sendFile(__dirname + '/views/contactus.html');
});

app.get("/leaderboard",async(req,res)=>{
  const LeaderboarDupT=await dbFunct.getStageTimeStampS(3007);
  const LeaderboarDdwT=await dbFunct.getStageTimeStampS(3008);

  const d = new Date();
  d.setTime(LeaderboarDupT);
  const up=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  d.setTime(LeaderboarDdwT);
  const dw=d.toLocaleString('en-US', {timeZone: "Asia/Kolkata"});
  console.log("Leaderboard Up Time: "+up);
  console.log("Leaderboard Down Time: "+dw);

  const date = new Date();
  if(date.getTime()>LeaderboarDupT&&date.getTime()<LeaderboarDdwT){
const users = await dbFunct.getAllUsers();
res.render("leaderboard",{users:users});
}
else if(date.getTime()<LeaderboarDupT)
res.render("beforeTime",{up:LeaderboarDupT,text:"Leaderboard"})
else
res.render("leaderBoardDown");
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


app.listen(app.get('port'),async()=> {
  console.log(`Server started on port ${app.get('port')}`);
    await sequelize.authenticate();
    console.log("db connected");
    const users =await dbFunct.getAllUsers();
    users.forEach(async(user) => {
      await dbFunct.updateLogged(user.userID,0);
    });
   
    const quesS1 = await dbFunct.getStage1Q(1001);
    if(!quesS1){
     
    await dbFunct.storeStage1Q(1001," Client, I'm your newsboy.(s----r)","server");
    await dbFunct.storeStage1Q(1002," What IT guys do on weekends.(d---d----)" ,"diskdrive");
    await dbFunct.storeStage1Q(1003," Computer spectacles enhances what.(w--s----)" ,"websight");
    await dbFunct.storeStage1Q(1004," Thirty-Six, but just eleven.(w-----s)" ,"windows");
    await dbFunct.storeStage1Q(1005," Which is one of extraterrestrials' favorite places on a computer's input device.(s----b--)" ,"spacebar");
    await dbFunct.storeStage1Q(1006," What a computer does when it's worn out.(c-----s)","crashes");
    await dbFunct.storeStage1Q(1007," The more you code the more of me there is what am i.(-u-)", "bug");
    await dbFunct.storeStage1Q(1008," You can touch it while seeing different colors in me. You interact with me There is an app icon inside me. Who am ?(g--)", "gui");
    await dbFunct.storeStage1Q(1009," I am a system of rule to convert information into another form ,but  you always messing with me by pushing and pulling me all the time. Don’t you have any manners? What am I?(---e)","code");
    await dbFunct.storeStage1Q(1010," I have no name, but I am given many. In biology i generate indentical copy of cell same as in  computer. Who am I ?(----e)","clone");
    await dbFunct.storeStage1Q(1011, "Which data structure retains the same pronunciation, even after you left with one letter after removing four out of five?(----e)", "queue");
    await dbFunct.storeStage1Q(1012, "I am a informal  language for everything yet everyone tells me fake and artificial . Good luck trying to compile me. What am I?(p--------e)", "pseudocode");
    }
    
    const quesS2 = await dbFunct.getStage2Q(2001);
    if(!quesS2){
      await dbFunct.storeStage2Q(2001,"Where is the BIOS stored?", "Hard Disk", "RAM", "Flash Memory Chip", "Any of above", "option3");
      await dbFunct.storeStage2Q(2002, "Internet is","complex system", " decentralized system", "dynamic system", "All of above", "option4");
      await dbFunct.storeStage2Q(2003, "Use of Telnet","Remote login", "connecting to TV", "transferring files across net", "All of above", "option1");
      await dbFunct.storeStage2Q(2004, "Another name for LCD", "LED", "TFT", "CRT", "All of above", "option3");
      await dbFunct.storeStage2Q(2005, "Which of the following is/are the another names for a PEN Drive", "USBFlashDrive", "GigStick", "ThumbDrive", "All of the above", "option4");
      await dbFunct.storeStage2Q(2006, "Which of the following is the device that is constructed with the series of sensors that detects hand and finger motion? ", "Digitizers","Dataglove","joystick","Track ball","option2");
      await dbFunct.storeStage2Q(2007, "Blue Griffon is based on which rendering engine.","Webkit","Presto","Mecko", "Gecko","option4");
      await dbFunct.storeStage2Q(2008, "Which is not the audio element’s attribute","controls","loop","Check","src","option3");
      await dbFunct.storeStage2Q(2009, "Which language does not support polymorphism but supports classes","Ada","C++","Small talk","java","option1");
      await dbFunct.storeStage2Q(2010, "What shall we use in the case of safe downcast","Static cast","Dynamic Cast","Manual cast","Implicit Cast","option2");
      await dbFunct.storeStage2Q(2011, "Size of class is"," Sum of the size of all inherited variables along with the variables of the same class"," The size of the class is the largest size of the variable of the same class"," Classes in the programming languages do not have any size","Sum of the size of all the variables within a class.","option3");
      await dbFunct.storeStage2Q(2012, "Which of the following does not have body", "interface", "class", "abstract method", "none of the above", "option3");
      await dbFunct.storeStage2Q(2013, "Special software to create a job queue is called", "Linkage editor", "Interpreter", "Spooler", "Drive", "option3");
      await dbFunct.storeStage2Q(2014, "Context switching is a part of ", "interrupt servicing","interrupt handling","polling","spooling", "option2");
      await dbFunct.storeStage2Q(2015, "The data blocks of a very large file in the Unix file system are allocated using", "contiguous allocation", "linked allocation", "indexed allocation", "an extension of indexed allocation", "option4");
      await dbFunct.storeStage2Q(2016, "Swap space resides in", "RAM", "Disk", "ROM", "On-chip cache", "option2");
      await dbFunct.storeStage2Q(2017, "When R∩S=φ, then cost of computing R Natural Join S is ", "the same as R×S", "greater than R×S", "less than R×S", "can not say anything", "option1");
      await dbFunct.storeStage2Q(2018, "R (A,B,C,D) is a relation. Which of the following does not have a lossless join dependency preserving BCNF decomposition", "A->B,B->CD", "A->B,B->C,C->D", "AB->C,C->AD", "A->BCD", "option4");
      await dbFunct.storeStage2Q(2019, "If both the functional dependencies : X→Y and Y→X hold for two attributes X and Y then the relationship between X and Y is" , "M:N", "1:M", "1:M", "1:1", "option4");
      await dbFunct.storeStage2Q(2020, "In tuple relational calculus P1 AND P2 is equivalent to" , "(¬P1OR¬P2)", "¬(P1OR¬P2)", "¬(¬P1OR P2)", "¬(¬P1OR¬P2)", "option4");
      await dbFunct.storeStage2Q(2021, "Who suggested the name", "C++", "Rrick Mascitti","Steve Jobs","Ken Thompson","Dennis Ritchie", "option1");
      await dbFunct.storeStage2Q(2022, "From which programming language Classes and Objects concept derived for C++?", "Java", "Simula67", "Objective C", "Fortran","option2");
      await dbFunct.storeStage2Q(2023, "An set of rules that usually runs in polynomial time however probably returns inaccurate solutions is known as a", "Las Vegas Algorithm", " Monte Carlo Algorithm",  "Atlantic City Algorithm", "Approximation algorithm", "option2");
      await dbFunct.storeStage2Q(2024, "Tabu search is", " A Binary Search Method", "Mathematical Optimization Method", "Non Associative", "The Acceptance Probability Function Is Used","option1");
      await dbFunct.storeStage2Q(2025, "Which of the following is a feature of DBMS?","Minimum Duplication and Redundancy of Data","High Level of Security", "Single-user Access only", "Support ACID Property", "option3");
      await dbFunct.storeStage2Q(2026, "SET concept is used in","Network Model", "Hierarchical Model", "Relational Model","None of these", "option1");
      await dbFunct.storeStage2Q(2027, "Which of the following data structure is required to convert arithmetic expression in infix to its equivalent postfix notation?", "Queue", "Linked list", "Binary search tree", "None of above","option4");
      await dbFunct.storeStage2Q(2028, "The time complexity of the normal quick sort, randomized quick sort algorithms in the worst case is", "O(n^2), O(n log n)", "O(n^2), O(n^2)", "O(n log n), O(n^2)", "O(n log n), O(n log n)", "option2");
      await dbFunct.storeStage2Q(2029, "When converting binary tree into extended binary tree, all the original nodes in binary tree are", "internal nodes on extended tree", "external nodes on extended tree", "vanished on extended tree","none", "option2");
      await dbFunct.storeStage2Q(2030, "The worst-case height of an AVL tree with n nodes is", "2 lg n", "1.39 lg n", "1.44 lg n",  "1.64 lg n", "option3");
    }

    const timeS = await dbFunct.getStageTimeStamp();

    if(!timeS[0]){
/*
To get time in number use below code

0-11 month

Remember to subtract 5 hours and 30 minutes

const eventD = new Date(2022,4,8,4,30,0);
eventD.setMilliseconds(0);
console.log(eventD.getTime())*/
    await dbFunct.storeStageTimeStamp(3001,"Stage 1 Up Time",1652272200000);
    await dbFunct.storeStageTimeStamp(3002,"Stage 1 Down Time",1652274000000);
    await dbFunct.storeStageTimeStamp(3003,"Stage 2 Up Time",1652275800000);
    await dbFunct.storeStageTimeStamp(3004,"Stage 2 Down Time",1652277600000);
    await dbFunct.storeStageTimeStamp(3005,"Stage 3 Up Time",1652340600000);
    await dbFunct.storeStageTimeStamp(3006,"Stage 3 Down Time",1652351400000);
    await dbFunct.storeStageTimeStamp(3007,"LeaderBoard Up Time",1652293800000);
    await dbFunct.storeStageTimeStamp(3008,"LeaderBoard Down Time",1654972200000);
    }
});
  