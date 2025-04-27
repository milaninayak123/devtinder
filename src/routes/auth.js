const express = require('express');
const authRouter = express.Router();
const {validateSignupData} = require('../utils/validation');
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post('/signup',async(req,res)=>{
    try{
        //validation of data
        validateSignupData(req);
        //extract below fields from req.body
        const {firstName,lastName,email,password} = req.body;
        //encrypt the pw. second arg is salt
        const passwordHash = await bcrypt.hash(password , 10);
        //new instance of model
        //only below fields are allowed
        const user = new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
        });
        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token" , token , {
            //set a cookie that expires after 8 hrs.
            expires : new Date(Date.now() + 8 + 3600000),
        });

        res.json({message: "user added successfully" , data: savedUser});
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

authRouter.post('/login',async(req,res)=>{
    try{
        //user passed email pw
        const {email , password } = req.body;
        //check user is there or not
        const user = await User.findOne({email:email});
        //if user not there
        if(!user){
            throw new Error("Invalid credentials");
        }

        //below arg is the pw sent by user. passing it in a func declared in user.js   
        //below we check the pw after checking above that email is valid 
        const isPasswordValid = await user.validatePassword(password);
        //if password is valid and login successful , we send the cookie with a token
        //for every user a diff token is generated
        //whenever now you make a call to some other api like profile same token is used to authorize the user
        if(isPasswordValid){
            //we generate a token for the logged in current user
            const token = await user.getJWT();
            //we send this cookie
            res.cookie("token",token , {
                expires: new Date(Date.now() + 8 *3600000),
            });
            res.send(user);
        }
        //if user email exists but pw is wrong
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

authRouter.post('/logout',async(req,res)=>{
    //set cookie token to null and expiring in the moment
    res.cookie("token", null , {
        expires: new Date(Date.now()),
    });
    res.send("user logged out");
})
module.exports = authRouter;

