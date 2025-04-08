const mongoose= require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        //creating a ref to user collection
        ref: "User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String ,
        required:true,
        enum : {
            values : ["not interested", "interested" , "accepted" , "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps:true,
}
);
//if you are passing one or values fields in findone fucntion , declaring just one field as index wont make the search faster it will remain slow.
//so we will have to index all fields which we are using for search.
//e.g:connectionRequestSchema.index({fromUserId:1 , toUserId:1});
//this is called combined indexing
//if you want to put an index on fromuserid. 1 represnts asceding , -1 descending
//created an index
connectionRequestSchema.index({fromUserId:1 , toUserId:1});

//this func saves the connection
//its like a middleware
//This is a Mongoose middleware, also called a hook. Specifically, it's a pre-save hook.
// use pre("save") when you want to modify or validate the data before it's saved to the database.
//everytime you call the save function , this function will be called first for validation which is why it is pre save

connectionRequestSchema.pre("save", function(next){
    const connectionRequest= this;
    //check if from user id same as to user id
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send req to yourself!!");
    }
    next();
});
const connectionRequestModel = new mongoose.model(
    "connectionRequestModel",
    connectionRequestSchema
);

module.exports = connectionRequestModel;