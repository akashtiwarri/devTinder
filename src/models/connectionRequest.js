const mongoose  = require('mongoose');


const connectionRequestSchema = mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User" // reference to the user collection
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ['ignored', 'interested', 'accepted', 'rejected'],
            message : `{VALUE} is incorrect status type`
        } 
    }
}, {
    timeStamps : true
}
);

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;