const dbFunct = require(__dirname+"/database.js");
const stage1Qlist=[1];
var stage2Qlist=[1];

exports.stage1Qlist=async()=>{
    try{
    const questions=await dbFunct.getAllStage1Q();
    questions.forEach((question)=>{
        stage1Qlist.push(question.dataValues.qID);
    });
    
    return stage1Qlist;
    }catch (err) {
        console.log(err);
    }
    
}

exports.stage2Qlist=async()=>{
    try{
    const questions=await dbFunct.getAllStage2Q();
    questions.forEach((question)=>{
        stage2Qlist.push(question.dataValues.qID);
    });
    const len = stage2Qlist.length-1;
    console.log("Length: "+len);
    for(a=0;a<10;a++){
    let x=Math.floor(Math.random() * len);
    let y=Math.floor(Math.random() * len);
    x=x+1;
    y=y+1;
    var b = stage2Qlist[y];
    stage2Qlist[y] = stage2Qlist[x];
    stage2Qlist[x] = b;
    }
    /*
    stage2Qlist=stage2Qlist.slice(0,11);
    stage2Qlist.forEach((item)=>{
     console.log(item);
    })*/

    
  //  return stage1Qlist;
 }catch (err) {
        console.log(err);
    }
    
}