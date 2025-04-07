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

module.exports = requestRouter;