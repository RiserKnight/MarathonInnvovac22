
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

const randQ="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
let stage1Qlist;

app.get("/",(req,res)=>{
res.render("home");
});


app.get("/stage1",(req,res)=>{
  res.render("Stage1/stage");
  });

app.get("/stage1/ques",async(req,res)=>{
  const index= stage1Qlist[0];
  const question = await dbFunct.getStage1Q(stage1Qlist[index]);
  if(index===stage1Qlist.length-1){
    res.render("Stage1/end")
  }
  else{
  res.render("Stage1/stageQue",{question: question.question,qID: question.qID});
  }
  });

  app.post("/stage1/ques/submit/:qID",async(req,res)=>{
    console.log("Submit Answer: "+req.body.answer);
    stage1Qlist[0]=stage1Qlist[0]+1;
   const result=await dbFunct.checkStage1Q(req.params.qID,req.body.answer);
   const x=0; 
   if(result){x=10;}
   dbFunct.storeSubmission(req.params.qID,0,10001,timeFunct.timeStamp(),x,1)
    res.redirect("/stage1/ques");
  
});

app.get("/stage2",(req,res)=>{
res.render("Stage2/stage");
});

app.get("/stage2/ques",(req,res)=>{
  res.render("Stage2/stageQue");
  });

app.listen(3000,async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
    stage1Qlist = await qFunct.stage1Qlist();
   // dbFunct.storeUser(10001,"Yum hai hum",0,1);
   /*
   for(a=1;a<10;a++){
     dbFunct.storeStage1Q(1000+a,randQ,"Answer")
   }
    */
  });
  