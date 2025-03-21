const express = require("express");
const connectDB= require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
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


