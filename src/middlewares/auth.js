const jwt = require('jsonwebtoken');
const User = require("../models/user"); // Assuming your User model is here

const userAuth = async (req, res, next) => {
    try {
        // Read the token from the request cookies
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Authentication failed: No token provided.");
        }

        // Verify the token and get the decoded object
        const decodedObj = jwt.verify(token, "DEV@Tinder$1311");
        
        // Use the decoded object's _id to find the user in the database
        const user = await User.findById(decodedObj._id);

        if (!user) {
            throw new Error("Authentication failed: User not found.");
        }

        // Attach the found user to the request object for use in subsequent routes
        req.user = user;

        // Call the next middleware in the chain
        next();
    } catch (err) {
        // If any error occurs, send a 401 Unauthorized status
        res.status(401).send('ERROR: ' + err.message);
    }
};

module.exports = userAuth;
