const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
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
