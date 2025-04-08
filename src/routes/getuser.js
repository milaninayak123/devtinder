const express = require('express');
const userRouter = express.Router();
//userauth needs to be extracted since its wrapped inside an object in auth.js
const {userAuth}= require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl about"
//GET all the pending connection request for the loggedIn user
userRouter.get("/user/requests/pending",userAuth , async(req,res)=>{
    try{
        //get the loggedin user
        const loggedInUser = req.user;
        //make a get call from db and get all conn req
        //here you will use find() , since that will return you an array of all connections
        //findOne is used when you need one object
        const connectionRequests = await connectionRequestModel.find({
            //to find all connections of a user , loggedinuserid should be = touserid (to whom req was sent)
            toUserId : loggedInUser._id,
            //also touserid can be accepted & ignored. we need to specify that return those touserids whose status is pending and that is interested status
            status : "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message:loggedInUser.firstName+ "'s pending requests",
            data:connectionRequests,
        });
        //above code will give you all pending  connections but you needa names etc of those pending req.
        //can be done by building relations bw 2 tables/collections
        //build a relation bw connectionreq collection to user coll.
        //do that in connectionrequestschema in models folder by creating a ref.

    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    

});


//get all the connections of the user.
userRouter.get("/user/connections", userAuth , async(req,res)=>{
    //akshay => elon => accepted
    //elon => mark => accepted
    //so find all connections where user is touser and fromuser with accepted state
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequestModel.find({
            $or:[
                {toUserId : loggedInUser._id , status : "accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"},
        ]           
        }).populate("fromUserId",USER_SAFE_DATA)
          .populate("toUserId",USER_SAFE_DATA);
//we just want names of connections
        const data = connectionRequests.map((row)=> {
            if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
           

        });
        res.json({
            message:loggedInUser.firstName+ "'s connections",
            data,
        });
    }catch(err){
        res.status(400).response("ERROR: "+ err.message);
    };
});
module.exports = userRouter;