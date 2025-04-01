const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        //below are called validations or schema types
        required: true,
        //model level validation
        minLength: 3,
        maxLength: 50,
    },
    lastName:{
        type:String,
        minLength:4,
        maxLength:50
       
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
      
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
            if(!validGenders.includes(value.toLowerCase())){
                throw new Error(  `not a valid gender`);
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
        validate:{
            validator: function(value){
                return value.length<7;
            },
        message: "you can add upto 6 skills only" 
        }
    },
   

},{
    timestamps:true,
});
//above is the schema i.e the definition of the model
//below model will create its own instances
//parameters for below: model name , schema name
const userModel = mongoose.model("User",userSchema);
module.exports=userModel;

//create a database,then collections like user
