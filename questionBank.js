const dbFunct = require(__dirname+"/database.js");
let stage1Qlist=[1];
let stage2Qlist=[1];

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
   
    let len = stage2Qlist.length-1;
      
    while(len!=0){
    const x=Math.floor(Math.random() * len)+1;    
    let b = stage2Qlist[len];
    stage2Qlist[len] = stage2Qlist[x];
    stage2Qlist[x] = b;
    len--;    
    }
    stage2Qlist=stage2Qlist.slice(0,11);

    return stage2Qlist;
 }catch (err) {
        console.log(err);
    }
    
}