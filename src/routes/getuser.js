const express = require('express');
const userRouter = express.Router();
//userauth needs to be extracted since its wrapped inside an object in auth.js
const {userAuth}= require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl about gender age"
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


//get feed api. when user logins , he will see others data in feed. 
userRouter.get("/feed", userAuth , async(req,res)=>{
    try{
        //User should see all the user cards except
        //0. his own card
        //1. his own connections
        //2. ignored people
        //3. already sent the conn req
        //e.g: rahul ,akshay,elon,makr,donald,ms dhoni , virat
        //rahul should see everyone except him on feed
        // if rahul sent req to elon he should everyone but not elon and himself
        // if elon rejected akshay , never show again akshay , if accepted elon then also no not in feed
        //  elon will see everyone but rahul
        // akshay will see everyone but rahul 
        // you will only see those cards whose profile never seen before
        //to all the people you have sent or from all you have received you should not see thm in profile
        const loggedInUser = req.user;
        //if you dont pass anything by default it will take page as 1 limit as 10.
        // we will parse the page and limit sent by user in query in req and if not sent anything default will be limit of 10
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        //if someone sending limit more than 50 then return 50 documents
        limit = limit >50 ? 50 : limit;
        const skip = (page-1)*limit;

        //find all connectionrequests that i have either sent or received
        const connectionRequests = await connectionRequestModel.find({
            $or: [
                //all req that i have either sent or received
                { fromUserId: loggedInUser._id} ,
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
//set ds is a ds that stores only unique values
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            // to every id i have sent request or from every id i have received req will be added to hide set
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        console.log(hideUsersFromFeed);
        //find all users who are not in the array hideusersfromfeed. nin mean not in
        //also find users who is not equal to himself
        //below is a func to convert set to an array
        const users = await User.find({
           $and:[ {_id: {$nin: Array.from(hideUsersFromFeed)},},
            {_id: {$ne: loggedInUser._id}},
           ],
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        res.json({data:users});
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
module.exports = userRouter;