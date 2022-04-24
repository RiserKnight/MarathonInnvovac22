
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const timeFunct = require(__dirname+"/Time.js");
const qFunct = require(__dirname+"/questionBank.js");
const {sequelize,UserDummy}=require('./models');
const multer = require("multer");
const path = require('path');
const formidable=require("formidable");
const fs=require("fs");
const { prependOnceListener } = require("process");
var cookieParser = require('cookie-parser');
var session = require('express-session');

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

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 3600000
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

var userContent = {userID: 205121002,userName: 'Aayush Gupta',userEmail:'205121002@nitt.edu', status: false}; 

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
  
      res.redirect("/home");
  } else {
      next();
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
cosole.log(eventD.getTime())*/

const Stage1upT=1650389100000;
const Stage1dwT=1650389220000;
const Stage2upT=1650389100000;
const Stage2dwT=1650389220000;

app.get('/', sessionChecker, (req, res) => {
  res.redirect("/login");
});

// route for user's dashboard
app.get('/home', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
  userContent.status = true; 
  userContent.userID = req.session.user.userID; 
  userContent.userEmail = req.session.user.userEmail;
  userContent.userName = req.session.user.userName; 
  console.log(JSON.stringify(req.session.user)); 
  res.render("home");    
  } else {
      res.redirect('/login');
  }
});

app.get("/stage1",async(req,res)=>{
  const date = new Date();
  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT){
  stage1Qlist = await qFunct.stage1Qlist();
  res.render("Stage1/stage");
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

app.get("/stage1/ques",async(req,res)=>{
  const date = new Date();
  if(date.getTime()>Stage1upT&&date.getTime()<Stage1dwT){
  const index= stage1Qlist[0];
  const question = await dbFunct.getStage1Q(stage1Qlist[index]);
  if(index===stage1Qlist.length-1){
    res.render("Stage1/end")
  }
  else{
  res.render("Stage1/stageQue",{sno:stage1Qlist[0],question: question.question,qID: question.qID});
  }
  }
  });

  app.post("/stage1/ques/submit/:qID",async(req,res)=>{
    console.log("Submit Answer: "+req.body.answer);
    stage1Qlist[0]=stage1Qlist[0]+1;
   const result=await dbFunct.checkStage1Q(req.params.qID,req.body.answer);
   let x=0; 
   if(result){x=10;}
   const curr = new Date();
   dbFunct.storeSubmission(req.params.qID,0,userContent.userID,curr.getTime(),x,1)
    res.redirect("/stage1/ques");
  
});

app.get("/stage2",async(req,res)=>{
  const date = new Date();
  if(date.getTime()>Stage2upT&&date.getTime()<Stage2dwT){
  stage2Qlist = await qFunct.stage2Qlist();
  res.render("Stage2/stage");
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

app.get("/stage2/ques",async(req,res)=>{
  const date = new Date();
  if(date.getTime()>Stage2upT&&date.getTime()<Stage2dwT){
  const index= stage2Qlist[0];
  const question = await dbFunct.getStage2Q(stage2Qlist[index]);
  if(index===stage2Qlist.length-1){
    res.render("Stage1/end")
  }
  else{
  res.render("Stage2/stageQue",{question: question.question,qID: question.qID,
    option1: question.option1,option2: question.option2,option3: question.option3,option4: question.option4});
  }
  }
});

app.post("/stage2/ques/submit/:qID",async(req,res)=>{
console.log(req.body.user_ans);
stage2Qlist[0]=stage2Qlist[0]+1;
const result=await dbFunct.checkStage2Q(req.params.qID,req.body.user_ans);
console.log(result);
res.redirect("/stage2/ques");
});


    // route for user Login
    app.route("/login")
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
    })
    .post((req, res) => {
        var userID = req.body.userID,
            password = req.body.password;
    
        UserDummy.findOne({ where: { userID: userID } }).then(function (user) {

            if (!user) {
                res.redirect("/login");
            } else if (!user.validPassword(password)) {
                res.redirect("/login");
            } else {
                req.session.user = user.dataValues;
                res.redirect("/home");
            }
        });
    });

    // route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
  userContent.status = false; 
      res.clearCookie('user_sid');
  console.log(JSON.stringify(userContent)); 
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});



const folder='./uploads';

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


app.post('/uploadfile', uploadMultiple, function (req, res, next) {
 
  if(req.files){
    var v= req.files.file2[0].path;
        console.log(req.files);
        console.log(v+ 'file uploaded successfully'); 
    fs.readFile(v,function(err,data){
      if(err){
        console.log(err);
      }
      console.log(data.toString());
    })  
    }
  });

  app.get("/stage3",(req,res)=>{
    res.sendFile(__dirname+"/views/Stage3/index1.html");
  });
  app.get("/stage3/que",(req,res)=>{
    res.sendFile(__dirname+"/views/Stage3/index2.html");
  });

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


app.listen(3000,async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
    /*UserDummy.create({
      userID: 205121002,
      userName: "Aayush Gupta",
      userEmail:"205121002@nitt.edu",
      password: "123"
    });*/
   // dbFunct.storeUser(10001,"Yum hai hum",0,1);
   
   //for(a=1;a<31;a++){
    // dbFunct.storeStage2Q(2000+a,randQ,"option1","option2","option3","option4","Answer");
   //  dbFunct.delStage1Q(2000+a); 
 // }
    
});
  