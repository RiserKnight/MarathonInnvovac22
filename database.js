const {sequelize,User,Stock,Events,Favourites,SellOrder,BuyOrder,StockHistory,StockHold}=require('./models')

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
        const demoUser=await Stock.create({groupID,userID})
    } catch (err) {
        console.log(err);
    }
    return "User Sucessfully added to group";
}

exports.storeStage1Q=async(qID,question,answer)=>{
  
    try {
        const demoUser=await Events.create({qID,question,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage1";
}

exports.storeStage2Q=async(qID,question,option1,option2,option3,option4,answer)=>{
  
    try {
        const demoUser=await Events.create({qID,question,option1,option2,option3,option4,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage2";
}

exports.storeStage3Q=async(qID,question,answer)=>{
  
    try {
        const demoUser=await Events.create({qID,question,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage3";
}

exports.storeStage4Q=async(qID,question,answer)=>{
  
    try {
        const demoUser=await Events.create({qID,question,answer})
    } catch (err) {
        console.log(err);
    }
    return "Question stored for Stage4";
}

exports.storeSubmission=async(qID,groupID,userID,timeStamp,timeValue,fPoint,stage)=>{
  
    try {
        const demoUser=await Events.create({qID,groupID,userID,timeStamp,timeValue,fPoint,stage})
    } catch (err) {
        console.log(err);
    }
    return "Submission Stored Succesfully";
}