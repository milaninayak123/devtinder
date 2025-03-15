const express = require("express");
const app = express();
const {adminauth , userauth} = require("./middlewares/auth");
//middlewares are written using app.use because you want your middlewares to work for get post delete all requests.
//we want to write middleware for all requests coming to /admin
//handle auth middleware for all requests
//if you want only for get do app.get else app.use will handle allrequests 
app.use("/admin",adminauth);
app.post("/user/login", (req,res)=>{
    res.send("user logged in successfully");
});
app.get("/admin/getAllData", userauth,(req,res)=>{
    res.send("all data sent");
})
app.get("/user" ,(req,res)=>{
    res.send("user's data sent");
});
app.get("/admin/deleteuser",(req,res)=>{
    //when you have multiple apis you will have to write the logic of checking if user is admin or not again and again

    res.send("deleted an user");
})
app.listen(3000 , ()=>
{
    console.log("server running in port 3000");
});