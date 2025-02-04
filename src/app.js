const express = require('express');
//instance of an express js application
//creating web server
//then listen code so everyone can connect
//listen method will take a port
const app = express();
//request handler
//here whatever request comes to the server we are saying the below

app.use("/",(req,res)=>
{
    res.send("hello milani !");
});
app.use("/test",(req,res)=>
    {
        res.send("hello from the server from test");
    });
app.use("/hello",(req,res)=>
    {
        res.send("hello hello");
    });

//how can we handle the server differently?

app.listen(3000 , ()=>
{
    console.log("server running");
});
