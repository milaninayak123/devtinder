const express = require("express");
const connectDB= require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
//middleware to parse json data input in postman to js   
app.use(cookieParser());
//import all routes from route folder
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter= require("./routes/request");

//how to use these above routes? like we write middleware
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
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


