
note:if you've above route handler it will always take the above route handler
and even if you run /hello , /test routes etc it will not print the console of those routes but will print the routes of just /route.
why?
note:if you search for a random route handler like /xyz you will get an invalid route error i.e cannot GET /xyz
but when you use /hello or /test etc it will also handle random hanlders if you search for it like /xyz
note: when you do app.use("/") and pass some route anything that matches after / will handle the route.
but you will have to follow this pattern: /hello/123 but not /hello123 

note:app.use("/",(req,res)=>
{
    res.send("hello milani !");
});
if you bring this code down and change the order of code and put /hello or /test on top and / route below then
when you do /hello you will get hello hello and not hello milani because when you pass / hello hello is the first route handler that you will encouter with */
so order of code matters
Whenever our req is coming code runs from top and starts matching from top
so order is very imp.
-whenever you’re going to a website you’re basically making a GET API Call on our server. 
-But you cannot make a post api call directly from your browser. You will have to write a code.
-Browser is the worst way to test your apis your backend code.
-API (Application Programming Interface) is like a waiter that helps two systems talk to each other, making sure you get the right information or service without needing to know how everything works behind the scenes.
-If i make a get call to user it should give me the data of user.
- if i make a post call to user and pass some data it should save the data to db
- . use will match all the HTTP method API calls to /test
- app.get("/user" , (req,res) =>{
    res.send({firstName:"milani" , lastName:"nayak"});
});
this will only handle GET call to /user

-- app.get("/user",(req,res)=>{
    //the below code will give you the info of query parameters.
    console.log(req.query);
    res.send({firstname:"milani"});
})

-- note: http://localhost:3000/user/707
can be handled by 
app.get("/user/:userId",(req,res)=>{
    console.log(req.params);
    res.send({firstname: "milani"});
}); 
-- you can even have complex route
e.g: http://localhost:3000/user/707/xyz
can be handled by :
app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send({firstname: "milani"});
}); 
## note: the aboves are dynamic routes and : represents that.
so all the above parameters like name pw etc are in req.params.

----------------------------------------------
episode 4: routing and request handlers summary:
-----------------------------------------------
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
});//after above get call won't interfere with post call.

app.delete("/user" , (req,res)=>{
    res.send("user deleted successfully");
});
-- so app.use can handle any type of method be it get post delete

//http://localhost:3000/user?userId-101&password=testing
// below is how you handle query parameters
app.get("/user" , (req,res)=>{
    console.log(req.query);
})

//how to handle dynamic apis
app.get("/user/:userId",(req,res)=>{
    console.log(req.params);
});
//The :userId in /user/:userId is a placeholder for dynamic values.
If you visit http://localhost:3000/user/101, it will capture 101 as req.params.userId.
When to Use Dynamic Routes?
Fetching user profiles: /user/:userId
Viewing a product: /product/:productId
Accessing a blog post: /blog/:postSlug
//above will handle http://localhost:3000/user/707
note:
with app.use("/user" , (req,res)=>{
    res.send("route handler 1");
});
with app.use you can handle any type of method

when you do: app.use("/user" , (req,res)=>{
    //res.send("route handler 1");
});
we comment out above and dont send anything what happens?
when a browser makes an api call to this it goes to an infinite loop 
because we are not sending anything and after some time timeout will happen
and nothing will be responded.
so you always need to send the response back. else your api call goes to an infinite loop.
--- 
one route can have multiple route handlers.
app.use("/user", (req,res)=>{
    res.send("hello from the server. itz response1");
},
(req,res)=>{
    console.log("handling the route user1");
    res.send("response2");
});
note: above we've 2 request handlers. when an api call is hit the first route handler will be called.
but suppose we comment out the first response , and hit an api call , what will happen?
-it will go into an infinite loop
-it will not go to the second request handler

app.use("/user", (req,res,next)=>{
    //res.send("hello from the server. itz response1");
    next();
},
(req,res)=>{
    console.log("handling the route user1");
    res.send("response2");
},
(req,res)=>{
    console.log("handling the route user1");
    res.send("response3");
}
);
---- now when we hit an api call next func will be called and the second response will be sent.
next function given by expressjs
this func means go to the next route handler

---what if you remove the comment of first responsenow you have 2 responses ready to be sent
first response will be sent
next function will also be execute
console.log of second route handler will also be printed
but an error will be thrown when our code will try to send another response
but like js works line by line all code will be executed
error bc we cnnot sent handlers after they're sent

now next() is written first and then 1st response od written what response will be sent to browser?
2nd response will be sent but will get an error when 1st response is called.



app.get("/user",(req,res)=>{
    res.send({firstName:"Milani", lastName:"Nayak"});
}
(req,res)=>{
    res.send("route handler 2");
}
); 

the functions above that we have put in the middle are known as middlewares.
how an express js app works?
//a get req to /users.
as soon as it comes it will go though the chain of middlewares and handle the response
it will check if the method(here get) and route (/users) is matching somewhere

job of express js server is to check the methods if it finds a match it will use the response of that func and will stop.
these functions are called middlewares in express.js
job of express js is go through the middlewares and find a response for the user request

note:A route handler does not call next() because it sends the final response
// Middleware 1: Logs request
app.use((req, res, next) => {
    console.log("🛑 Middleware 1: Logging request");
    next();
});

// Middleware 2: Checks for authentication (dummy example)
app.use((req, res, next) => {
    console.log("🔒 Middleware 2: Checking authentication");
    const isAuthenticated = true; // Change to false to see what happens
    if (!isAuthenticated) {
        return res.status(403).send("Access Denied");
    }
    next();
});

// Route Handler
app.get("/dashboard", (req, res) => {
    console.log("✅ Route Handler: Sending dashboard response...");
    res.send("Welcome to your dashboard!");
});

Middleware (app.use): Pre-processes request (logs, modifies, authenticates)
e.g:Logging, authentication, validation
Route Handler (app.get):Sends final response to client
e.g: Handling API requests

how express js handles requests bts?
it goes through the chain one by one and finds a response and give it back to client
use of middlewares?
suppose you've a route app.get()

AUTHORIZED :

app.get("/admin/getAllData" ,(req,res)=>{
    //check if teh req is authrozied i.e the user is actually an admin or not
    //logic
    const token ="xyddz";
    const isAdminAuthorized = token == "xyz"
    if(isAdminAuthorized){
        //by default status 200
        res.send("all data sent");
    }
    else{
        //401 code is for unauthorized user 
        res.status(401).send("admin not unauthorized")
    }
});
app.get("/admin/deleteuser",(req,res)=>{
    //when you have multiple apis you will have to write the logic of checking if user is admin or not again and again

    res.send("deleted an user");
})
AFTER USING MIDDLEWARE:
app.use("/admin",(req,res,next)=>{
    console.log("admin is getting authorized");
    const token ="xyz";
    const isAdminAuthorized = token == "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("unauthorzed request");
    }
    else{
        next();
    }
})
app.get("/admin/getAllData" ,(req,res)=>{
    res.send("all data sent");
});
why middlewares come into use?
because they help in handling multiple requests at a time
it helps in handling authentication type stuff for a route and it will authorize for just that route e.g /admin
Middleware helps in:

✅ Handling multiple requests efficiently by processing them before they reach the route handler.
✅ Authentication & Authorization by verifying users before allowing access to specific routes (e.g., /admin).
✅ Modifying requests (e.g., logging, d  ata validation) before sending a response.
🔹 Example: A middleware can check if a user is an admin before allowing access to /admin, blocking unauthorized users. 🚀

auth.js : to check authentication of /user /admin
for clean code we write all these in a middleware folder inside that in auth.js
const adminauth =(req,res,next)=>{
    console.log("admin is getting authorized");
    const token ="xyz";
    const isAdminAuthorized = token == "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("unauthorized admin request");
    }
    else{
        next();
    }
};
const userauth =(req,res,next)=>{
    console.log("user is getting authorized");
    const token ="xyzer";
    const isuserauthorized = token == "xyz";
    if(!isuserauthorized){
        res.status(401).send("unauthorized user request");
    }
    else{
        next();
    }
};
module.exports = {
    adminauth,
    userauth,
};
how will we use this in app.js?
const app = express();
const {adminauth , userauth} = require("./middlewares/auth");
//middlewares are written using app.use because you want your middlewares to work for get post delete all requests.
//we want to write middleware for all requests coming to /admin
//handle auth middleware for all requests
//if you want only for get do app.get else app.use will handle allrequests 
app.use("/admin",adminauth);
app.use("/user",userauth);
//above can also be written as app.get("/user" , userauth , (req,res)=>{
// so when a /user req will come first it will go to niddleware userauth and authenticate user if passed then only next() func will be called and will go to route handler else from there only send that not authenticated


app.get("/user" ,(req,res)=>{
    res.send("user's data sent");
});
app.get("/admin/getAllData",(req,res)=>{
    res.send("all data sent");
})
app.get("/admin/deleteuser",(req,res)=>{
    //when you have multiple apis you will have to write the logic of checking if user is admin or not again and again

    res.send("deleted an user");
})
app.listen(3000 , ()=>
{
    console.log("server running in port 3000");
});

2 ways OF IMPORTING MIDDLEWARE CODE TO app.js
in the below way we are deciding for what kind of api call we need to authorize the user
for getting data , user authentication is required
for logging in we dont because it should be open for all
but once logged in we need to authorize them

app.post("/user/login", (req,res)=>{
    res.send("user logged in successfully");
});
app.get("/admin/getAllData", userauth,(req,res)=>{
    res.send("all data sent");
})

ERROR Handling
//below is a way to handle errors and the order of writing error, req etc matters
//order : req , res | req,res,next | error , req , res , next
//below is also known as middleware
app.use("/",(error,req,res,next)=>{
    //handle error
    if(error){
    res.status(500).send("Something went wrong");
}});

//how to handle error for individal route handlers?
app.get("/getuserdata" ,(req,res)=>{
    try{
        //logic of db call and get user data
        throw new Error("jjwc");
        res.send("user data sent");
    }catch(err){
res.status(500).send("error");
    }
});

//order matters
.use is called first 
then .get. 
EPISODE 6: DATABASE , SCHEMAS AND MODELS MONGOOSE
1st thibg: connect our application to the DATABASE
we want our application to connect to the cluster we created

user.js:
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    first_name: {
        type:string
    },
    emailId:{
        type:string
    },
    password:{
        type:string
    },
    age:{
        type:Number
    }


});
//above is the schema i.e the definition of the model
//below model will create its own instances
const userModel = mongoose.model("User",userSchema);
module.exports = userModel;

//create a database,then collections like user

you can also write like this: 
-----------------
CREATE API
app.post("/signup",(req,res)=>{
    const UserObj ={
        firstName : "Milani",
        lastName:"Nayak",
        email:"milaninayak123@gmail.com",
        password:"milaninayak123"
    }
    //create a new user with above data
    //creating new instance of User Model
    const user = new User(UserObj);
    user.save();
});
this is one way of creating new instances of user model

way2:
syntax:
const user = new ModelName({
    fname:"jd",
    ld,
});
user.save();

/////////////ASYNC AWAIT
//////POST A USER DATA SYNTAX 
//CREATED AN API STORING DUMMY DATA TO DB
app.post("/signup",async(req,res)=>{
    const user = new User({
        firstName : "Milani",
        lastName:"Nayak",
        email:"milaninayak123@gmail.com",
        password:"milaninayak123"
    });
    //create a new user with above data
    //creating new instance of User Model
    
    await user.save();
});
\
///CONNECT TO DB FIRST THEN START server
const express = require("express");
const connectDB= require("./config/database");
const app = express();
const User = require("./models/user");


app.post("/signup",async(req,res)=>{
    const user = new User({
        firstName : "Milani",
        lastName:"Nayak",
        email:"milaninayak123@gmail.com",
        password:"milaninayak123"
    });
    await user.save();
    user.send("user added successfully");
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


COORECT CODE FOR CONNECTING DATABASE , STARTING THE SERVER & POSTING
APP.JS:
const express = require("express");
const connectDB= require("./config/database");
const app = express();
const User = require("./models/user");


app.post("/signup",async(req,res)=>{
    const user = new User({
        firstName : "Milani",
        lastName:"Nayak",
        email:"milaninayak123@gmail.com",
        password:"milaninayak123"
    });
    await user.save();
    res.send("user added successfully");
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


USER.JS:
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
    },
    emailId:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
    },


});
//above is the schema i.e the definition of the model
//below model will create its own instances
//parameters for below: model name , schema name
const userModel = mongoose.model("User",userSchema);
module.exports=userModel;

//create a database,then collections like user

DATABASE.JS
//will write the logic to connect to database
//we will use an npm library mongoose
//used to create schemas , talk to database etc
const mongoose = require("mongoose");
//wrap your connection inside an async function
const connectDB = async()=>{
    //connected to cluster. inside that cluster we will create a db named devtinder
    await mongoose.connect("mongodb+srv://db:dbuserpw@devtinder.fbgj8.mongodb.net/?retryWrites=true&w=majority&appName=devtinder");
};
//call this function

module.exports = connectDB;

//in this file you have just created the function to connect to db 
//db connection is done in app.js . here you are exporting your func
//in app.js importing this func,using it first then starting the server
NOTE: THE FIELD NAMES IN APP.JS SHOULD BE EXACTLY SAME AS YOU HAVE DECLARED IN USER.JS LIKE NAME AGE etc
note: whenever doing any db operation like saving your data etc always wrap them inside try catch block.
and handle your responses appropriately

SUMMARY: 
create database.js:
1. const mongoose = require("mongoose");
const connectdb = async()=>{
    await mongoose.connect = "";
}
write the func for connecting to mongoose
in app.js:
call that function which was created in database.js. then connect to server. 
app.post("/signup",async(req,res)=>{
    //created a new instance of the model User
    const user= new User({
        firstname ='milani',
    });
    try{
        await user.save();
        res.send("posted");
    }catch(err){
        res.status(400).send("user cant be added"+err.message);
    }
});
connectDB.then(()=>{
    console.log("db connected");
    app.listen(7777,()=>{
        console.log("server connected");
    });
});
.catch((err)=>{
    console.log("cant connect");
})
EPISODE 7: DIVING INTO apis
currently our user is acceptingrequests in js but user is sending data is json
so we will need a middleware to convert json to js
so we will use app.use(express.json()) in app.js file


POST DYNAMICALLY
check app.js old one 
instead of hard coding we will send data from postman in raw json format.
in app.js we will handle it like this: app.post("/signup",async(req,res)=>{
    const user = new User(req.body);
    try{
    await user.save();
    res.send("user added successfully");
}catch(err){
    res.status(400).send("error saving the data"+ err.message);
}
}); replace hardcoded data with req.body

second part: get all data
1. get just one user's data. can do that by email. 
GET ONE USER INFO 
app.get("/user",async(req,res)=>{
    const useremail = req.body.email;
    try{
        const user= await User.find({email:useremail});
        if(user.length===0){
            res.status(401).send("user not found");
        }
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
GET ALL USERS DATA
/feed api - get /feed - get all the users from the db
app.get("/feed",async(req,res)=>{
    
    try{
        const user= await User.find({});
        res.send(user);
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});
//.findOne is a func that will return only one document if there are multiple email ids with same email
// GET AN USER USING iD 
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

UPDATE API , DELETE API
DELETE API TO DELTE A USER BY iD
app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});

UPDATE API 
//update data of the user 
app.patch("/user",async (req,res) =>{
    const userId = req.body.userId;
    const data = req.body;
    try{
       await User.findByIdAndUpdate({_id:userId},data);
       res.send("user updated successfully");
    }catch(err){
        res.status(400).send("something went wrong");
    }

});

below is how you will pass your req in body of postman:
{
   "userId": "67dd5b7449f46de50225e721",
   //using above id we will update all below data
   "firstName": "chubu",
   "email":"chubu@gmail.com"
}
note: using update , any other data if you enter which is 
not in the schema will be ignored by the db 
OPTIONS: explore in mongodb document 

Currently we arent doing any data sanitisations. any data is being stored in db.
we want that every field should have a limit like name in 7 to 8 chars
email must contain @ etc. this is called data sanitisation.

and that is wat we will learn now in this episode. 
episode 8:data sanitizations and schema validations 
1. first we will add some strict checks into our user schema 
if not met wont insert them in db 
e.g: there must be some mandatory fields in our db 
if not there we wont insert them to our db 
like email pw name etc. required fields to signup 

there are diff types of schemas and required is one of them
how you can use it?
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
    },
})
now user will have to give a firstName else mongoose will not allow the insertion into the database
user.js: 
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName:{
        type:String,
       
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true
        
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        //custom validation function
        //below validation func will only run whenb  you're creating  a new user not with update
        validate(value){
            const validGenders = ["male", "female"];
            if(!validGenders.includes(value.toLowerCase)){
                throw new Error(  `🚨 Oops! "${value}" is not a valid gender. Try "male" or "female"—or take it up with the admin!`);
        }
    }
    },
    photoUrl:{
        type:String,
        default:"https://img.freepik.com/premium-vector/gray-avatar-icon-vector-illustration_276184-163.jpg",
    },
    about:{
        type: String,
        //if a user doesnt enter about this will be displayed in db
        default: "this is a default value",
    },
    skills:{
        type:[String],//array of skills
    },
});
//above is the schema i.e the definition of the model
//below model will create its own instances
//parameters for below: model name , schema name
const userModel = mongoose.model("User",userSchema);
module.exports=userModel;

//create a database,then collections like user
FOR VALIDATION FUNC TO WORK WITH UPDATE METHOD WE HAVE TO EXPLICITLY IN THE UPDATE route handler specify the option as true.
like this: 
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
check user.js on how to add validators to each field in a schema like user to make it cleaner , secure
NEXT LESSON:
suppose you dont want users to update their email.
how to do that?
you want if user updating his profile he can only update certain fields of his profile
by API LEVEL VALIDATION .
app.patch("/user/:userId",async (req,res) =>{
    const userId = req.params?.userId;
    const data = req.body;

    try{
    const ALLOWED_UPDATES=[
        "photo-url" , "about" , "gender" , "age" , "skills"
    ]
    //looping through every key like userid , name etc and check if present in allowed updates
    const isUpdate_Allowed = Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdate_Allowed){
       throw new Error("update not allowed");
    }
       const user = await User.findByIdAndUpdate({_id:userId},data,{
        runValidators:true,

       });
       res.send("user updated successfully");
    }catch(err){
        res.status(400).send("something went wrong:" + err.message);
    }

});
data sanitization: add api validation for each field before sedning to db
its hard to write validators. so you can take help of external library called npm validator.
so we will use VALIDATOR LIBRARY.
E.G:
email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid error address: " + value);
            }
        },

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong pw. Try again!");
            }
        },
        
    },
    SEASON 2 EP9 -ENCRYPTING passwordS
    pw should be stored in a hashed format 
    encrypted format 
    our signup api is itself not safe 
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
as soon as a user hits the signup api the first thing to be done is validate the data
if data is not correct then throw an error and dont let user create an account
then if validated hash the pws 
then save it 
sometimes we create utility/helper fucntions to validate our data 
create a folder utils in src folder.
here you will write all kind of validations in this file

in validation.js you can write all your validations.

const validator = require('validator');
const validateSignupData = (req)=>{
    //from the req.body extract all the fields. do js axtraction. then validate the field one by one
    const {firstName , lastName , email , password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("EMail is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Not a strong password. Try again !");
    }
    else if(!validator.isURL(photoUrl)){
        throw new Error("Not a valid img link");
    }
};
then export it.
import it in app.js and call it in signup post api call. 
always wrap inside try catch block 
app.post("/signup",async(req,res)=>{
    try{
    //validation of data
    validateSignupData(req);
    //new instance of model
    const user = new User(req.body);
  
    await user.save();
    res.send("user added successfully");
}catch(err){
    res.status(400).send("ERROR: "+ err.message);
}
});

NOW ENCRYPT YOUR PW USING A NPM PACKAGE BCRYPT 
second arg in hash func is no of rounds of salts 
how many no of rounds that salt should be applied to create a pw
more encryption level , harder to decrypt. 
salt =1 0 standard

HOW TO WRITE CORRECT POST API FUNCTION? (SIGNUP API)
app.post("/signup",async(req,res)=>{
    try{
    //validation of data
    validateSignupData(req);
    //extract below fields
    const {firstName,lastName,email,password} = req.body;
    //encrypt the pw. second arg is salt
    const passwordHash = await bcrypt.hash(password , 10);
    console.log(passwordHash);
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
STEPS:
NEVER TRUST REQ.BODY. WHATEVER IS COMING IN THERE.
YOU ONLY ACCEPT THE FIELDS WHICH YOU WANT 
1. VALIDATING. FOR THAT IMPORT VALIDATION FUNC WRITTEN IN VALIDATION.JS 
2. EXTRACT FIELDS WHICH YOU WANT USER TO INPUT LIKE NAME etc
3. CREATE HASH PASSWORD
4. STORE HASH PW

LOGIN API 
check email , pw
first check if a user with that email exists or not 
if yes then check pw
LOGIN API:
app.post("/login", async(req,res)=>{
    try{
        const {email , password } = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Email id doesn't exist");
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(isPasswordValid){
            res.send("User login successful");
        }
        else{
            throw new Error("Password not valid");
        }
    }catch(err){
        res.status(400).send("something went wrong "+ err.message);
    }
});

note: never expose the reason of failure
always say Invalid credentials.
attacker shouldnt know why he couldnt login 
EPISODE 10 - AUTHENTICATION, COOKIES , JWT TOKENS(ADVANCED LEVEL OF AUTHENTICATION)
we will be creating a token putting token into cookie 
sending it to user
now user has cookies 
whenever a req is made to the server a cookie will be sent 
and you'll validate if user is authentic or not 
SCENARIO: i am a user. i want to access my profile info. i cant access it unless i login. all these things need authentication
user is requesting a website or hitting a server api call. user will make a connection request. 
-if user wants to communicate with server it will have to create a connection using tcp. after getting response it will close the connection.
so an user requests. made the api call. send the response back. close connection. 
everytime user makes an api call , it needs to be authenticated. user should be logged in.
--- a user comes.makes a login request. server says email pw correct. then gives you json web token to user. it is stored with user.
with all the requests after login jwt will be sent. and everytime server will validate if tokem is correct or not. 
e.g: everytime you are opening linkedin , liking somone's post etc , everytime this token is sent to server and server everytime validates the token if crrect or not.
how will user store the token? 
cookies. 
when login to application it will validate if valid email and pw , if yes then server will send successful login along with that 
will create a jwt token and will add this inside a cookie. cookie will stored in the browser.
in ressponse back to user it will give the cookie. 
when a user makes a request or api call cookie will travel , validated then sent back along with response to user.
when will cookie not work? when cookie expires after a time limit and you are making a request using that cookie which is now old.
so wont work, will fail the validation. 
will have to login again.

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
            //store it in cookie
            //send the response back to user
            res.cookie("token","dededwed");
            res.send("User login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});
here we are creating our cookie and storing it.

now you want to get the profile or check your profile. so you will have to hit the get call to profile 
now for you to be able to read token in profile you need another library , a middleware to read our hwt token. cookie parser
so whenever a req comes , cookies will be parsed. 
JWT TOKEN: JSON WEB TOKEN 
IT IS AN ENCRYPTED HASH. IT can contain special info isnside it.
this token is divided into 3 things:
header (red), payload (pink)- secret data which i will hide inside the token from server, signature (blue)-jwt uses to check if this token is valid or not

HOW TO CREATE A JWT TOKEN AND USE IT INSIDE YOUR COOKIE?
NEED ONE MORE PACKAGE i.e JSONWEBTOKEN

install that
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
            const token = await jwt.sign({_id:user._id},"DEV@Tinder$3498");
            console.log(token);
            //store it in cookie
            //send the response back to user
            
            res.cookie("token",token);
            res.send("User login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});
now our jwt token is added to login api 
PROCESS:
a user is coming. logging with email pw.
if validated , creating a token , hiding the user id inside it
sending it back to user. 
everytime you login it will create a new user 

note: you make an api call. api call will not work unless you have the token. 
only way to get the api call work and get the token is by logging in.
so if you want to access the profile or any page of an user , you need to first login , you'll get the jwt token.
GET API CALL :
//get profile
app.get("/profile",async(req,res)=>{
    try{      
    const cookies = req.cookies;
    //extract token from cookies
    const {token} = cookies;
    //validate the token, if valid send the response back i.e accessing datanelse say please login
    //or your cookie has expired
    if(!token){
        throw new error("Invalid Token");
    }
    const decodedmsg = await jwt.verify(token,"DEV@Tinder$3498");
    
    const {_id} = decodedmsg;
    console.log("logged in user is: "+ _id);
    const user = await User.findById(_id);
    //token is valid but user doesnt exist
    if(!user){
        throw new Error("Username doesn't exist");
    }
    res.send(user);

} catch(err){
    res.status(400).send("error: "+ err.e)
}});

before than in login api we are checking if user email pw is valid or not:
LOGIN: 
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
            const token = await jwt.sign({_id:user._id},"DEV@Tinder$3498");
            console.log(token);
            //store it in cookie
            //send the response back to user
            
            res.cookie("token",token);
            res.send("User login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});
PROCESS OF JWT TOKENS:
1. user is sending me an email and pw.
2. server is validating whether email and pw correct. this happens in login.
3. then it is creating a jwt token
4. putting it inside cookie.
5. sending it back 
6. everytime cookie comes server will check whose cookie is it
7. based on that it will give the profile access of that user.
8. cookie has a hideen info that whose id it belongs to
9. steps to sign & verify jwt tokens?
Note:
you have to add authentication in all the apis 
CREATE YOUR AUTH MIDDLEWARE
why do we need that first of all?
we want all apis to work after authentication except signup and login. dont need authentication for that.
all the other apis dont have a token check.
NOTE
when you call profile api 
app.get("/profile", userAuth,async(req,res)=>{
    first userauth middleware will be called
    it will run the code
    check the token validate it , find user and if everything goes well next fucntion will be called.
    then 
    async(req,res)=>{
    try{      
    const cookies = req.cookies;
    //extract token from cookies
    const {token} = cookies;
    //validate the token, if valid send the response back i.e accessing datanelse say please login
    //or your cookie has expired
    if(!token){
        throw new error("Invalid Token");
    }
    const decodedmsg = await jwt.verify(token,"DEV@Tinder$3498");
    
    const {_id} = decodedmsg;
    const user = await User.findById(_id);
    //token is valid but user doesnt exist
    if(!user){
        throw new Error("Username doesn't exist");
    }
    res.send(user);

} catch(err){
    res.status(400).send("error: "+ err.e)
}});

auth.js:
const userAuth =async (req,res,next)=>{
     //Read the token from the req cookies
     //extract the token
     try{
     const {token} = req.cookies;
     if(!token){
        throw new Error("Token is not valid.");
     }
     //verify
     const decodedObj = await jwt.verify(token , "DEV@Tinder$3498");
     //get id from the decodedobj
     const {_id} = decodedObj;
     //if id is present find the user using id
     const user = await User.findById(_id);
     //if user not present
     if(!user){
        throw new Error("User not found");
     }
     //whatever user i found on the db i will attach it to the req and call next
     req.user = user;
     next()
     }catch(err){
        res.status(400).send("ERROR: "+err.message);
     }

};
above function will be called
 //whatever user i found on the db i will attach it to the req and call next

so now updated profile api:
//get profile
app.get("/profile", userAuth,async(req,res)=>{
    try{      
    const user = req.user;
    res.send(user);

} catch(err){
    res.status(400).send("error: "+ err.e)
}});
NOTE:
always first login. 
then hit the profile api. 
if milani logging in then profile of milani will be given
if arvind logs in then on profile api call arvind's profile will be sent 

SENDCONNECTIO request
app.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user.firstName+ " "+user.lastName +" requested to connect with you");
    }catch(err){
        res.send("Error: "+err.message);
    }
});
we have added the userauth middleware whcih will authentivate the user
will work on if  auser logs in then calls this api.
so users not logged in cant call this api
So going forward while creating any api use the middleware userauth 
user needs to be authenticated only then will be able to request connetion accept like etc.

USERAUTH IS VERY IMP AND IT IS A MIDDLEWARE 
EXPIRE JWT TOKEN:

Currently we are just using the jwt token and not expiring it
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
            const token = await jwt.sign({_id:user._id},"DEV@Tinder$3498",{expiresIn:"1D" });
           
            //store it in cookie
            //send the response back to user
            
            res.cookie("token",token);
            res.send("User login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});
//check the above on how you can add the expire date.
like 1d 2d 1h etc.
so if expiry is 1d user will need to login every 1 day again
and a new token is generated
here you are just expiring your tokens. you can also expire your cookies.
this is how you do it:
res.cookie("token",token , {
                expires: new Date(Date.now() + 8 *3600000),
            });

WHAT IS MONGOOSE SCHEMA METHODS?
e.g userschema we have. it defines the user
we can attach few methods onto the schema that is applicable to all the users.
what are these methods?
helper methods closely related to user. 
e.g: while logging in an user , we are creating a jwt token and secretly inserting userid in it. 
that method is very closely related to user.
every user will have a diff way of signing. 
so thats why we can offload such functions to userSchema
 const token = await jwt.sign({_id:user._id},"DEV@Tinder$3498",{expiresIn:"7D" });
the above function of writing jwt token can be offloaded to a hanlder method i.e userschema
so we will declare the jwt in user.js.
userSchema.methods.getJWT =async function () {
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$3498",{
        expiresIn:"7D" 
    });
    return token;
}
we will not use arrow functio here since we are using this. 
this fucntion dosnt work in arrow func

this refers to one particular instance of a user model.
app.post("/login", async(req,res)=>{
    try{
        const {email , password } = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);
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
});
much cleaner login api.
## so writing these helper functions separately in a handler method like user schema we can always reuse it for other apis if needed other than login api
makes our code readable
## we can also offload our bcrypt function (to validate the pw)
code after doing the above:
app.post("/login", async(req,res)=>{
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
});
user.js:
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash= user.password;
    //1st parameter is the pw that user entered , 2ns is the actual pw of user
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash
    );
    return isPasswordValid;
}
the above is a schema method
end of video. this was s2e10 video. (imp one for jwt etc)

S2 E11: 
DIVING INTO APIS AND EXPRESS ROUTER
build more apis and features.
first list down all apis to add in this project
now currently we are handling apis in a very bad way.
we are writing all the apis in one file app.js.
we will now use express router to manage our apis.
we have 13 apis now , will group them into small catgeroes and create separate routers for all apis.
note: tinder groups 20 profiles in one api so you left right swipe 20 profiles and in that 1 api call is made then againa nother api .

CREATING EXPRESS ROUTER
create a folder routes
auth.js: this router will manage all apis like login logout etc
HOW TO CREATE A ROUTER?
const express = require('express');
const authRouter = express.Router();

authRouter.get('/');
module.exports = authRouter;
note: router is used to manage routes when there are so many routes. to manage them well.
# routing , middleware . request handlers.
app.use("/",authRouter);
go to authrouter and check is there any router matching with /.
note: if suppose an api comes i.e /login , it will check / in app.use("/",authRouter); then go to authrouter and check all apis. and there it will find login api.then run the code from there.

e.g2: if suppose an api comes i.e /profile , it will check and find / in app.use("/",authRouter);
it will check all apis in this and will not find any match.
will then go to next line i.e profile route. will find matching api and execute its code.
so express js goes one by one.
main jon of express is to whenever you get a route it tries to check fot all the rouetrs request handlers middlewares wherever any match found it will send the response back.
profile.js:
profileRouter.get("/profile", userAuth,async(req,res)=>{
    try{      
    const user = req.user;
    res.send(user);

} catch(err){
    res.status(400).send("error: "+ err.e)
}});
profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
try{
    if(!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request");
    }
    res.send('edit successful');
const loggedInUser = req.user;
loggedInUser.firstName = req.body.firstName;
loggedInUser.lastName = req.body.lastName;
loggedInUser.age = req.body.age;
loggedInUser.skills = req.body.skills;
loggedInUser.email = req.body.email;
loggedInUser.about = req.body.about;
loggedInUser.photoUrl = req.body.photoUrl;

console.log(loggedInUser);
}catch(err){
    res.status(400).send("ERROR: "+err.message);
}
});
one thing in this api we did is hard coding.
instead we will write like this:
Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));
here object.keys will give the age photoURl etc from req.body. foreach loop will run for every key in the body i.e for age about skills etc and for every key loggedinuser of that key e.g skill of that loggedinuser will be updated to the skill in req.body.
loggedinuser represents req.user.
we get that req.user from auth.js middleware

CREATE CONNECTION REQUEST
MAKE APIS SCHEMAS ETC.
HOW WILL WE SEND CONNECTION REQ IN DB?
BEST WAY IS TO KEEP IT AWAY FROM USER SCHEMA
CREATE ONE MORE ANOTHER SCHEMA OF CONNECTION.
now how to send connection req?
const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequestModel = require('../models/connectionRequest');

//below api is just for interested and ignored. it can be either one of these.
//to make sure of that you need to validate your data
//make sure to handle corner cases. like 2 things. 1. first the thi g i mentioned above
//2. if you sent p a request you cant send p request again , p cant send you request.

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try{
        //req.user is the user sending req.
        const fromUserId = req.user._id;
        const toUserId= req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status});
        }
        //if already a request exists
        const exisitingConnectionRequest = await connectionRequestModel.findOne({
            //using or condition find
            $or: [
                     //if you have already sent req once
                {fromUserId,toUserId},
                //if both are trying to send eo req
                {fromUserId :toUserId , toUserId:fromUserId},
            ],
        });
        if(exisitingConnectionRequest){
            return res.status(400).send("Connection Request already exists");
        }
        const connectionRequest = new connectionRequestModel(
            {
                fromUserId,
                toUserId,
                status,
            }
        );
    const data = await connectionRequest.save();
    res.json({
        message: "connection req sent successfully",
        data,
    });
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    
   
});

module.exports = requestRouter;
connection.js
//here we are avoding  a deadlock. that a is trying to send a req to b , b is tryin to send req to a.
//below api is just for interested and ignored. it can be either one of these.
//to make sure of that you need to validate your data
//make sure to handle corner cases. like 3 things. 1. first the thi g i mentioned above
//2. if you sent p a request you cant send p request again , p cant send you request.
//3. check if the id to which you are sending req it exists or not. you can send req to any random id

note: learn about schema methods and schema pre.
ONE WAY OF WRITING YOUR CODE:
//below will execute when you call the save function ,before save tjis will execute and will check if your from and to user idsa resame ot not. if not next() func will be called.

connectionRequestSchema.pre("save", function(next){
    const connectionRequest= this;
    //check if from user id same as to user id
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send req to yourself!!");
    }
    next();
});

HOW TO PUT AN INDEX IN YOUR DATABASE?
INDEXES AND COMPOUND INDEXES in mongodb
JOB OF INDEX: MAKE YOUR QUERY FASTER
You need indexes in your database. 
An index in a database is like the index at the back of a book — it helps you quickly find the data you're looking for without scanning every document.

🚀 Why Do We Need Indexes?
When the database grows (e.g., millions of users or requests), searching becomes slow.

Indexes make read/search queries faster and more efficient.

Without indexes, MongoDB performs a collection scan — checking every document one by one.

🧠 Example Use Case
In a dating app like DevTinder:

You search users by email every time they log in.

Without an index, the login API will get slower as the user base increases.

Creating an index on email speeds this up.

✅ MongoDB Automatically Creates Indexes:
If a field is set as unique: true, MongoDB automatically creates an index for it.

js
Copy code
email: {
  type: String,
  unique: true
}
🛠️ How to Create Indexes Manually
You can create indexes on any field using:

js
Copy code
Schema.index({ fieldName: 1 }); // 1 for ascending, -1 for descending
Example:

UserSchema.index({ email: 1 }); // Index on email for faster search
🔗 Compound / Combined Indexing
If you're searching using multiple fields, indexing only one field won’t help much.

You should use compound indexing:

js
Copy code
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
This speeds up queries like:

js
Copy code
ConnectionRequest.findOne({ fromUserId, toUserId });
⚠️ Things to Keep in Mind
Too many indexes = more storage & write overhead.

Indexes speed up read operations, but slow down write operations slightly (because index also has to be updated).

Use indexes only on fields that are frequently searched or sorted.

📝 Quick Summary
Concept	Purpose
index: true	Manually create index on a field
unique: true	Auto creates unique index
Schema.index({})	Used for compound indexes
Index improves	Read/Search speed
Too many indexes    Increases write cost & memory usage
and all of these will be written in the model/schema file.

Advantages of Creating Indexes
Faster query performance – Indexes allow MongoDB to locate data without scanning the entire collection.

Improves API response time – Especially useful for login/search features (e.g., finding users by email).

Helps with scalability – Keeps queries fast even when the database grows large.

Enables efficient sorting – Indexes make sort() operations much faster.

Used in aggregations – Stages like $match in aggregation pipelines benefit from indexes.

Enforces uniqueness – Fields like email can use unique: true to avoid duplicates.

Supports compound queries – Compound indexes optimize queries that use multiple fields.

❌ Disadvantages of Creating Indexes
Slows down write operations – Insert/update/delete operations become slightly slower due to index updates.

Consumes extra storage – Each index takes up disk space.

Maintenance overhead – Too many indexes can make the database harder to manage.

Not always effective – If queries don’t match the index fields properly, the index won’t be used.

Can reduce performance if misused – Unnecessary or poorly chosen indexes can actually degrade performance.
note: always take care of corner cases else that will be an oppurtunity for attackers.

E13:
REF, POPULATE AND THOUGHT PROCESS OF WRIITNG APIS

note: thought process of writing post apis is diff from writing get apis. 
Thought Process - POST VS GET API
How can an attacker exploit your POST api?
by sending random data into api and we put that data into db.

How can an attacker exploit your GET api?
they can get some information.
here we will make sure we are only sending allowed data. authorize the user , we are sedning info to correct user


NOTE:
        const connectionRequests = await connectionRequestModel.find({
            //to find all connections of a user , loggedinuserid should be = touserid (to whom req was sent)
            toUserId : loggedInUser._id,
            //also touserid can be accepted & ignored. we need to specify that return those touserids whose status is pending and that is interested status
            status : "interested",
        }).populate("fromUserId",["firstName" , "lastName"]);

        create a link bw two collections connectionRequest and users by creating a ref and by that you can fetch any data from user like name etc and populate it in fromUSerId 
        .populate("fromUserId",["firstName" , "lastName"]); if you dont mention second argument all the data of those users who requested will be sent which is wrong.
        so second arg is like a filter. 
        
SO POPULATE & REF ARE 2 IMP CONCEPTS LEARNT
#add ref in the schema object.

MIDDLEWARE: series of components that form a pipeline through which every http requests and response flows. it examines the incoming req, modifies the request / response if needed , invoke the next middleware in the pipeline if exists , or short circuits the process and responds itself.

ROUTING: match incoming http requests to specific end points.

FEED API:
//get feed api. when user logins , he will see others data in feed. 
userRouter.get("/feed", userAuth , async(req,res)=>{
    try{
        //User should see all the user cards except
        //0. his own card
        //1. his own connections
        //2. ignored people
        //3. already sent the conn req
        //e.g: rahul ,akshay,elon,makr,donald,ms dhoni , virat
        //rahul should see everyone except him on feed
        // if rahul sent req to elon he should everyone but not elon and himself
        // if elon rejected akshay , never show again akshay , if accepted elon then also no not in feed
        //  elon will see everyone but rahul
        // akshay will see everyone but rahul 
        // you will only see those cards whose profile never seen before
        //to all the people you have sent or from all you have received you should not see thm in profile
        const loggedInUser = req.user;
        //find all connectionrequests that i have either sent or received
        const connectionRequests = await connectionRequestModel.find({
            $or: [
                //all req that i have either sent or received
                { fromUserId: loggedInUser._id} ,
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
//set ds is a ds that stores only unique values
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            // to every id i have sent request or from every id i have received req will be added to hide set
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        console.log(hideUsersFromFeed);
        //find all users who are not in the array hideusersfromfeed. nin mean not in
        //also find users who is not equal to himself
        //below is a func to convert set to an array
        const users = await User.find({
           $and:[ {_id: {$nin: Array.from(hideUsersFromFeed)},},
            {_id: {$ne: loggedInUser._id}},
           ],
        }).select(USER_SAFE_DATA);
        res.send(users)
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
FEED API is made now. understand the logic.
suppose db has 1000s of users.
when an user logins i dont want him/her to get 999 profiles at the same time.
api should only return 10 users at a time.
we want to add a feature of pagination.

PAGINATION:
in get api you can add query params.
/feed?page=1limit=10 (means page=1 and limit is 10) => first 10 users 1-10

/feed?page=2 limit=10 => 11-20 => skip(10) & limit(10)
/feed?page=3 limit=10 => skip 20 records and give 10 records

in mongodb we have 2 funcs
.skip() & .limit()
.limit() means how many documents you want
.skip() means how many documents to skip from starting
.skip(0) & .limit(10) means skipping 0 users and adding 10 users document to feed

LEARN DIFF BW REQ.PARAMS AND REQ.QUERY HOW TO PASS THEM
params is passed like :1w2e
query is passed like: ?ksxws

PAGINATION: using the limit function an attacker can attack by sending limit as 100000 or so if we have many users and this will freeze or hang the db because it is making such an expensive query. 
so this is called sanitization.
so its important to set a limit for each page.
each page should contain around 10 documents.



ENHANCEMENTS TO MAKE IN THIS PROJECT:
1. IF WE HAVE 100000 USERS , we should show in feed the users who have similar skills etc
2. you can add filters. user wants to see all users with skills set js they want to connect with them.


NOTE: ALWAYS KEEP YOUR RESPONSES STANDARD. FOR EVERY API.
E.G: res.send(users)
OR FOLLOW:
res.json({data:users});
//so you create an object , attach data and msg if you want to.

ADVICE: always send response in json format.
