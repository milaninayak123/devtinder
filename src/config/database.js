const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://db:dbuserpw@devtinder.fbgj8.mongodb.net/devtinder?retryWrites=true&w=majority&appName=devtinder")
};

module.exports = connectDB;
