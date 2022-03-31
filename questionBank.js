const dbFunct = require(__dirname+"/database.js");
const stage1Qlist=[1];
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