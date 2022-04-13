
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const timeFunct = require(__dirname+"/Time.js");
const qFunct = require(__dirname+"/questionBank.js");
const {sequelize}=require('./models');


const app = express();
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const randQ="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
let stage1Qlist=[1],stage2Qlist=[1];

app.get("/",(req,res)=>{
res.render("home");
});


app.get("/stage1",async(req,res)=>{
  stage1Qlist = await qFunct.stage1Qlist();
  res.render("Stage1/stage");
  });

app.get("/stage1/ques",async(req,res)=>{
  const index= stage1Qlist[0];
  const question = await dbFunct.getStage1Q(stage1Qlist[index]);
  if(index===stage1Qlist.length-1){
    res.render("Stage1/end")
  }
  else{
  res.render("Stage1/stageQue",{sno:stage1Qlist[0],question: question.question,qID: question.qID});
  }
  });

  app.post("/stage1/ques/submit/:qID",async(req,res)=>{
    console.log("Submit Answer: "+req.body.answer);
    stage1Qlist[0]=stage1Qlist[0]+1;
   const result=await dbFunct.checkStage1Q(req.params.qID,req.body.answer);
   let x=0; 
   if(result){x=10;}
   dbFunct.storeSubmission(req.params.qID,0,10001,timeFunct.timeStamp(),x,1)
    res.redirect("/stage1/ques");
  
});

app.get("/stage2",async(req,res)=>{
  stage2Qlist = await qFunct.stage2Qlist();
  res.render("Stage2/stage");
  });

app.get("/stage2/ques",async(req,res)=>{
  const index= stage2Qlist[0];
  const question = await dbFunct.getStage2Q(stage2Qlist[index]);
  if(index===stage2Qlist.length-1){
    res.render("Stage1/end")
  }
  else{
  res.render("Stage2/stageQue",{question: question.question,qID: question.qID,
    option1: question.option1,option2: question.option2,option3: question.option3,option4: question.option4});
  }
});

app.post("/stage2/ques/submit/:qID",async(req,res)=>{
console.log(req.body.user_ans);
stage2Qlist[0]=stage2Qlist[0]+1;
const result=await dbFunct.checkStage2Q(req.params.qID,req.body.user_ans);
console.log(result);
res.redirect("/stage2/ques");
});

app.get("/login",(req,res)=>{
res.sendFile(__dirname+"/views/login.html");
});


app.listen(3000,async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
    
   // dbFunct.storeUser(10001,"Yum hai hum",0,1);
   
   //for(a=1;a<31;a++){
    // dbFunct.storeStage2Q(2000+a,randQ,"option1","option2","option3","option4","Answer");
   //  dbFunct.delStage1Q(2000+a); 
 // }
    
});
  