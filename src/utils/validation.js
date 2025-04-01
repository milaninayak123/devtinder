const validator = require('validator');
const validateSignupData = (req)=>{
    //from the req.body extract all the fields. do js axtraction. then validate the field one by one
    const {firstName , lastName , email , password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Not a strong password. Try again !");
    }
   
};

module.exports = {
    validateSignupData,
}