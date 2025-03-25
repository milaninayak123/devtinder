const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        //below are called validations or schema types
        required: true,
        minLength: 4,
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
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);
            },
            message: (props) => `"${props.value}" is not a valid Gmail address! Please use an email ending with @gmail.com.`
        }
        
    },
    password:{
        type:String,
        required:true,
        validate(value){
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(value)) {
                throw new Error(
                    ` Weak password! Your password must have:
                    - At least 1 uppercase letter (A-Z)
                    - At least 1 number (0-9)
                    - At least 1 special character (@, #, $, etc.)
                    - Minimum 8 characters`
                );
            };
        }
        
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
