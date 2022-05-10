
const {User,Stage1,Stage2,Submission,usersStage1,usersStage2,usersStage3,stage1QList,stage2QList,stageTime}=require('./models')

//********************************** Create Opeartions**********************************

exports.storeUser=async(userID,name,points,currStage,loggedin)=>{
   
    try {
        const demoUser=await User.create({userID,name,points,currStage,loggedin})
    } catch (err) {
        console.log(err);
    }
    return "User Sucessfully stored";
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



exports.storeSubmission=async(qID,userID,timeStamp,fPoint,userans,stage)=>{
  
    try {
        console.log("Database: "+userans);
        const demoUser=await Submission.create({qID,userID,timeStamp,fPoint,userans,stage})
    } catch (err) {
        console.log(err);
    }
    return "Submission Stored Succesfully";
}

exports.storeIndex1=async(userID,index,visit)=>{
    try {
        await usersStage1.create({userID,index,visit}); 
    } catch (error) {
        console.log(err);
    }
    return "Index 1 Stored Succesfully";
}
exports.storeIndex2=async(userID,index,visit)=>{
    try {
        await usersStage2.create({userID,index,visit}); 
    } catch (error) {
        console.log(err);
    }
    return "Index 2 Stored Succesfully";
}
exports.storeIndex3=async(userID,questionNo,submission)=>{
    try {
        await usersStage3.create({userID,questionNo,submission}); 
    } catch (err) {
        console.log(err);
    }
    return "Index 3 Stored Succesfully";
}
exports.storeStage1QList=async(userID,list)=>{
    try {
        await stage1QList.create({userID,list})
    } catch (error) {
        console.log(error);
    }
}

exports.storeStage2QList=async(userID,list)=>{
    try {
        await stage2QList.create({userID,list})
    } catch (error) {
        console.log(error);
    }
}
exports.storeStageTimeStamp=async(timeID,purpose,timeStamp)=>{
    try {
        await stageTime.create({timeID,purpose,timeStamp})
    } catch (error) {
        console.log(error);
    }
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

exports.delStage2QList=async(userID)=>{
    try {
        await stage2QList.destroy({where:{userID:userID}});
    } catch (error) {
        console.log(error);
    }
}
exports.delStage3Submission=async(userID)=>{
    try {
        await usersStage3.destroy({where:{userID:userID}});
    } catch (error) {
        console.log(error);
    }
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
     const demo=await User.findAll({order:[["points","DESC"]]});
     demo.forEach(user => {
         users.push(user.dataValues);
     });
     return users
    }
    catch(err){
        console.log(err);
            }
}
exports.getAllSubmission=async()=>{

    try{
     const demo=await Submission.findAll();
   
     return demo;
    }
    catch(err){
        console.log(err);
            }
}
exports.getAllSubmissionQ=async(qID)=>{

    try{
     const demo=await Submission.findAll({where:{qID:qID}});
   
     return demo;
    }
    catch(err){
        console.log(err);
            }
}
exports.getUsersStage1=async()=>{
    let users=[];
    try{
     const demo=await usersStage1.findAll();
     demo.forEach(user => {
         users.push(user.dataValues);
     });
     return users
    }
    catch(err){
        console.log(err);
            }
}
exports.getUsersStage2=async()=>{
    let users=[];
    try{
     const demo=await usersStage2.findAll();
     demo.forEach(user => {
         users.push(user.dataValues);
     });
     return users
    }
    catch(err){
        console.log(err);
            }
}

exports.getIndex1=async(userID)=>{
    try {
       const demo= await usersStage1.findOne({
            where:{userID:userID}
        }); 
        return demo.dataValues;
    } catch (error) {
        console.log(err);
    }
}
exports.getIndex2=async(userID)=>{
    try {
       const demo= await usersStage2.findOne({
            where:{userID:userID}
        }); 
        return demo.dataValues;
    } catch (error) {
        console.log(err);
    }
}
exports.getIndex3=async(userID,questionNo)=>{
    try {
       const demo= await usersStage3.findOne({
            where:{userID:userID,questionNo:questionNo}
        }); 
        if(demo)
        return demo.dataValues;
        else
        return 0;
    } catch (error) {
        console.log(err);
    }
}
exports.getAllIndex3=async(userID)=>{
    let index3=[];
    try {
       const demo= await usersStage3.findAll({
            where:{userID:userID}
        }); 
        if(demo){
         demo.forEach(index => {
             index3.push(index.dataValues);
         });
         return index3;
        }
        
        else
        return 0;
    } catch (error) {
        console.log(err);
    }
}
exports.getStageTimeStamp=async()=>{
    let timing=[];
    try {
       const demo= await stageTime.findAll({order:[["timeID","ASC"]]});
       if(demo){
        demo.forEach(index => {
            timing.push(index.dataValues);
        });
        return timing;
       }
       else
       return 0;
    } catch (error) {
        console.log(error);
    }
}
exports.getStageTimeStampS=async(timeID)=>{
  
    try {
       const demo= await stageTime.findOne({where:{timeID:timeID}});
       if(demo)
        return demo.dataValues.timeStamp;
       else
       return 0;
    } catch (error) {
        console.log(error);
    }
}
exports.getStage1QList=async(userID)=>{
    try {
        const list = await stage1QList.findOne({where:{userID:userID}})
        return list.dataValues.list
    } catch (error) {
        console.log(error);
    }
}
exports.getStage2QList=async(userID)=>{
    try {
        const list = await stage2QList.findOne({where:{userID:userID}})
        return list.dataValues.list
    } catch (error) {
        console.log(error);
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
exports.updateLogged=async(userID,loggedin)=>{
    try{
        await User.update(
            {loggedin: loggedin},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}
exports.updateIndex1=async(userID,index)=>{
    try{
        await usersStage1.update(
            {index: index},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}
exports.updateIndex2=async(userID,index)=>{
    try{
        await usersStage2.update(
            {index: index},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}

exports.updateVisit1=async(userID,visit)=>{
    try{
        await usersStage1.update(
            {visit: visit},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}

exports.updateVisit2=async(userID,visit)=>{
    try{
        await usersStage2.update(
            {visit: visit},
            {where:{userID:userID}
        });
    }
    catch(err){
        console.log(err);
            }
}

exports.updateStageTimeStamp=async(timeID,timeStamp)=>{
    try {
        await stageTime.update({timeStamp:timeStamp},
            {where:{timeID:timeID}});
    } catch (error) {
        console.log(error);
    }
}