const jwt = require('jsonwebtoken');
const User = require("../models/user");
//userauth middleware is checking if token exists and user is found we will call the next(). it will call the request handler like profile
//you will get the logged in user info using this middleware

//req.user gives the info of current loggedin user

const userAuth =async (req,res,next)=>{
     //Read the token from the req cookies
     //extract the token
     try{
     const {token} = req.cookies;
     if(!token){
        throw new Error("Token is not valid.");
     }
     //verify
     const decodedObj = await jwt.verify(token , "DEV@Tinder$3498");
     //get id from the decodedobj
     const {_id} = decodedObj;
     //if id is present find the user using id
     const user = await User.findById(_id);
     //if user not present
     if(!user){
        throw new Error("User not found");
     }
     //whatever user i found on the db i will attach it to the req and call next
     req.user = user;
     next()
     }catch(err){
        res.status(400).send("ERROR: "+err.message);
     }

};
module.exports = {
    userAuth,
};