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

const validateEditProfileData = (req)=>{
    const allowedEditFields = [
        "firstName" , "lastName" , "email" , "age" , "skills" , "about" , "photoUrl"
    ];
    //check the input that user has done in user.body. if that is present in allowededitfields then edit can be done
    const isEditAllowed = Object.keys(req.body).every((field)=>
    allowedEditFields.includes(field)
);
return isEditAllowed;
};
const validateEditPassword = (req)=>{
    const currentpw = req.body.currpassword;
    if(currentpw==userAuth.password){
        const newpw= req.body.newpassword;
    }
    
    
}

module.exports = {
    validateSignupData,
    validateEditProfileData
}