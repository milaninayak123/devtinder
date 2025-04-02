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
        await user.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

authRouter.post('/login',async(req,res)=>{
    try{
        const {email , password } = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        //below arg is the pw sent by user. passing it in a func declared in user.js
    
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //whatever the urrent user is the user token will come back
            const token = await user.getJWT();
            res.cookie("token",token , {
                expires: new Date(Date.now() + 8 *3600000),
            });
            res.send("User login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})
module.exports = authRouter;

