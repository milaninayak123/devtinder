const express = require("express");
const connectDB= require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
//imp1
app.post("/signup",async(req,res)=>{
    //new instance of model
    const user = new User(req.body);
    try{
    await user.save();
    res.send("user added successfully");
}catch(err){
    res.status(400).send("error saving the data"+ err.message);
}
});
//get user by email
app.get("/user",async(req,res)=>{
    const useremail = req.body.email;
    try{
        const user= await User.find({email:useremail});
        if(user===0){
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
//feed api - get /feed - get all the users from the db
app.get("/feed",async(req,res)=>{
    
    try{
        const user= await User.find({});
        res.send(user);
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
//GET user by id
app.get("/id",async(req,res)=>{
    const userId = req.body._id;
    try{
        const user = await User.findById({_id:userId});
        if(user===0){
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
//delete one user by id
//imp2
app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
//imp3
//update data of the user 
app.patch("/user",async (req,res) =>{
    const userId = req.body.userId;
    const data = req.body;
    try{
       const user = await User.findByIdAndUpdate({_id:userId},data,{
        runValidators:true,

       });
       res.send("user updated successfully");
    }catch(err){
        res.status(400).send("update failed:" + err.message);
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


