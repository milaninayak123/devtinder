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