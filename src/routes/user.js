const express = require('express');
const userAuth = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();

// Get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", ['firstName', 'lastName'])
        res.json({ message: "Data fetched successfully!", data: connectionRequest })
    }
    catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

module.exports = userRouter;