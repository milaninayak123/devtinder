const express = require('express');
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const { isStrongPassword } = require('validator');

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
   
const loggedInUser = req.user;

Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));
//after above line edit will be done
await loggedInUser.save();
//below is a good oractice to send the data you updated in json
res.json({message:`${loggedInUser.firstName}, your profile edit is successful!!`,
data:loggedInUser,
});

}catch(err){
    res.status(400).send("ERROR: "+err.message);
}
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { currpassword, newpassword } = req.body;

        // Get logged-in user
        const user = req.user;

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currpassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Validate new password strength
        if (!isStrongPassword(newpassword)) {
            return res.status(400).json({ message: "New password is not strong enough" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword, salt);

        // Save updated user
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//check user is logged in
// will take existing , new pw
//check if exisitng is correct or not using bcrypt.compare
//if then check if new pw is strong or not

module.exports= profileRouter;