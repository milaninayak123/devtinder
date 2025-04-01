const express = require("express");
const connectDB= require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignupData} = require('./utils/validation');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
//middleware    
app.use(cookieParser());
//imp1
app.post("/signup",async(req,res)=>{
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
app.post("/login", async(req,res)=>{
    try{
        const {email , password } = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(isPasswordValid){
            //create a jwt token
            //we will hide the user id inside token i.e the first param , second param is a secret key that only developer knows
            //not the user or anyone
            const token = await jwt.sign({_id:user._id},"DEV@Tinder$3498",{expiresIn:"7D" });
           
            //store it in cookie
            //send the response back to user
            
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
});
//get profile
app.get("/profile", userAuth,async(req,res)=>{
    try{      
    const user = req.user;
    res.send(user);

} catch(err){
    res.status(400).send("error: "+ err.e)
}});
//api to send connection req
app.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user.firstName+ " "+user.lastName +" requested to connect with you");
    }catch(err){
        res.send("Error: "+err.message);
    }
});
connectDB()
    .then(() => {
    console.log("database connection established");
    app.listen(7777,()=>{
        console.log("server successfully listening on port 7777");
    });
})
.catch((err)=>{
    console.log("db cant be connected");
});


