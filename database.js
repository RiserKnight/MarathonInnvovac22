
const {User,Stage1,Stage2,Stage3,Stage4,Group,Submission}=require('./models')

//********************************** Create Opeartions**********************************

exports.storeUser=async(userID,name,points,currStage)=>{
   
    try {
        const demoUser=await User.create({userID,name,points,currStage})
    } catch (err) {
        console.log(err);
    }
    return "User Sucessfully stored";
}

exports.storeUserInGroup=async(groupID,userID)=>{
  
    try {
        const demoUser=await Group.create({groupID,userID})
    } catch (err) {
        console.log(err);
    }
    return "User Sucessfully added to group";
}

exports.storeStage1Q=async(qID,question,answer)=>{
  
    try {
        const demoUser=await Stage1.create({qID,question,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage1";
}

exports.storeStage2Q=async(qID,question,option1,option2,option3,option4,answer)=>{
  
    try {
        const demoUser=await Stage2.create({qID,question,option1,option2,option3,option4,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage2";
}

exports.storeStage3Q=async(qID,question,answer)=>{
  
    try {
        const demoUser=await Stage3.create({qID,question,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage3";
}

exports.storeStage4Q=async(qID,question,answer)=>{
  
    try {
        const demoUser=await Stage4.create({qID,question,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage4";
}

exports.storeSubmission=async(qID,userID,timeStamp,fPoint,stage)=>{
  
    try {
        const demoUser=await Submission.create({qID,userID,timeStamp,fPoint,stage})
    } catch (err) {
        console.log(err);
    }
    return "Submission Stored Succesfully";
}


//**********************************Delete Operations **********************************

exports.delStage1Q=async(qID)=>{
    try{
        const que=await Stage1.findOne({
            where:{qID:qID}
        })
         console.log(que.dataValues.qID);
        await que.destroy()
    
        }catch(err){
    console.log(err);
        }
    return "Question deleted "+ qID+" for Stage1";
}


//**********************************Read Operations **********************************

exports.getStage1Q=async(qID)=>{
    try{
        const question=await Stage1.findOne({
            where:{qID:qID}
        });
        if(question)
        return question.dataValues;
        else
        return 0;
        } 
          catch(err){
            console.log(err);
                }
    
}

exports.getAllStage1Q=async()=>{
    try{
        const questions=await Stage1.findAll();
        if(questions)
        return questions;
        else
        return 0;
        } 
          catch(err){
            console.log(err);
                }
}

exports.getStage2Q=async(qID)=>{
    
    try{
        const question=await Stage2.findOne({
            where:{qID:qID}
        });
    
        if(question)
        return question.dataValues;
        else
        return 0;
    } 
          catch(err){
            console.log(err);
                }
    
}

exports.getAllStage2Q=async()=>{
    try{
        const questions=await Stage2.findAll();
        if(questions)
        return questions;
        else
        return 0;
        } 
          catch(err){
            console.log(err);
                }
}

exports.getUserCurrStage=async(userID)=>{
    try{
        const user=await User.findOne({
            where:{userID:userID}
        });
    
     
        return user.currStage;
        } 
          catch(err){
            console.log(err);
                }
}
exports.getUser=async(userID)=>{
    try{
        const demo=await User.findOne({
            where:{userID:userID}
        });
       if(demo)             
       return demo.dataValues;
       else
       return 0
        } 
          catch(err){
            console.log(err);
                }
}
exports.getUserPoints=async(userID)=>{
    try{
        const demo=await User.findOne({
            where:{userID:userID}
        });
        if(demo)     
        return demo.dataValues.points;
        else{
        console.log("User Not Found");
        return 0;
        }
        } 
          catch(err){
            console.log(err);
                }
}

exports.getAllUsers=async()=>{
    let users=[];
    try{
     const demo=await User.findAll();
     demo.forEach(user => {
         users.push(user.dataValues);
     });
     return users
    }
    catch(err){
        console.log(err);
            }
}
//**********************************Check Operations **********************************


exports.checkStage1Q=async(qID,answer)=>{
    try{
        const question=await Stage1.findOne({
            where:{qID:qID}
        });
        const res = Boolean(answer==question.answer);
        return res;
        } 
          catch(err){
            console.log(err);
                }
   
}

exports.checkStage2Q=async(qID,answer)=>{
    try{
        const question=await Stage2.findOne({
            where:{qID:qID}
        });
        const res = Boolean(answer==question.answer);
        return res;
        } 
          catch(err){
            console.log(err);
                }
   
}

//**********************************Update Operations **********************************

exports.updateUserPoints=async(userID,points)=>{
    try{
        await User.update(
            {points: points},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}
exports.updateUserStage=async(userID,stage)=>{
    try{
        await User.update(
            {currStage: stage},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}