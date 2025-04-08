const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
//below api is just for interested and ignored. it can be either one of these.
//to make sure of that you need to validate your data
//make sure to handle corner cases. like 2 things. 1. first the thi g i mentioned above
//2. if you sent p a request you cant send p request again , p cant send you request.
//3. you cant send request to ids that dont exist so validate your touserid
//4. you cant send connection req to yourself
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try{
        //req.user is the user sending req.
        const fromUserId = req.user._id;
        const toUserId= req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["not interested","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status});
        }
       
        //check if touserid exist in db or not
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message: "user doesn't exist"});
        }
        //if already a request exists
        const exisitingConnectionRequest = await connectionRequestModel.findOne({
            //using or condition find
            $or: [
                     //if you have already sent req once
                {fromUserId,toUserId},
                //if both are trying to send eo req
                {fromUserId :toUserId , toUserId:fromUserId},
            ],
        });
        if(exisitingConnectionRequest){
            return res.status(400).send("Connection Request already exists");
        }
        const connectionRequest = new connectionRequestModel(
            {
                fromUserId,
                toUserId,
                status,
            }
        );
    const data = await connectionRequest.save();
    res.json({
        message: 
        req.user.firstName+  " is " + status + " in " + toUser.firstName,
        data,
    });
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    
   
});
//here also you need auth middleware since you need user to be logged in for user to accept
requestRouter.post("/request/review/:status/:requestId", 
    userAuth, 
    async(req,res)=>{
    try{
        //below ddone by userAuth
       const loggedInUser = req.user; 
       const {status , requestId} = req.params;
       //logic for accept or reject
       //before starting be clear of corner cases
       const allowedStatus = ["accepted" , "rejected"];
       if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Invalid status"});
       }
//check if id is correct or not
 const connectionRequest=await connectionRequestModel.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status:"interested",
 });
if(!connectionRequest){
    return res.status(404)
    .json({message: "Connection req not found!"});
}
//if all needs fulfilled
//below status is updated with accepted or not accepted
connectionRequest.status = status;   
const data = await connectionRequest.save();
res.json({message: "Connection Request: "+ status , data});
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

module.exports = requestRouter;



/*
corner cases for accept api:
e.g: akshay sent req to elon
//validate the status. 
1. check if elon is loggedin. 
2. only toUSerId is authorised to accept that particluar req.
3. accepted or not accepted can only happen if status from fromuserid is interested
if not interested no accept or rejct. status should be interested.
4. reqid should be valid pr present in db
*/

/*
steps of wriitng :
check user loggedin using the middleware
add allowed statuses
if status inputted by user not in allowedstatus throw err
dynamic status how will you allow? you will have to read it by extracting the status from req.params. like this:     const {status , requestId} = req.params;
now once status is checked , check if requestid present in db or not

*/