const express = require("express");
const app = express();

//all the API calls will be handled by this route handler if the below is present
//the below api route handlers will never get a chane
//if a req comes and it takes /user
// app.use("/user" , (req,res)=>{
//     res.send("hello");
// });
// will work for both abc and ac
//ab+c means abbc abbbc etc will work
//ab*cd means abhsdhcd will work.
// a(bc)?d means bc is optional
//a(bc)+d means abcbbcbcd will work
//app.get(/a/ , (req,res)=>{
    //}) here regex expressions like /a/ will work if the req has any a it will work
    /*e.g: /.*fly$/ */

app.get("/user" , (req,res) =>{
    console.log(req.query);
    res.send({firstName:"milani" , lastName:"nayak"});
});

app.post("/user", (req,res)=>{
    //saving data to db
    res.send("data saved successfully to db");
});//after above get call won't interfere will post call.

app.delete("/user" , (req,res)=>{
    res.send("user deleted successfully");
});
// . use will match all the HTTP method API calls to /test
app.use("/test",(req,res)=>
{
    res.send("hello milani !");
});
app.listen(3000 , ()=>
{
    console.log("server running");
});
