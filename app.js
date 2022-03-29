
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const {sequelize}=require('./models')

const app = express();
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",(req,res)=>{
res.render("home");
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
  });
  