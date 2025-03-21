const express = require("express");
const connectDB= require("./config/database");
const app = express();
const User = require("./models/user");


app.post("/signup",async(req,res)=>{
    const user = new User({
        firstName : "minati",
        lastName:"nayak",
        email:"minati123@gmail.com",
        password:"minatimihir",
        age:22
    });
    try{
    await user.save();
    res.send("user added successfully");
}catch(err){
    res.status(400).send("error saving the data"+ err.message);
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


