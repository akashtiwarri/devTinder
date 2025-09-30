const express = require('express');
const { ValidateSignupData } = require('../utils/validation');
const User = require('../models/user')
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        ValidateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        // Creating a new instance of the User Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send('User added successfully!!')
    }
    catch (err) {
        res.status(400).send('ERROR : ' + err)
    }
})
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials!!")
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // Create JWT token
            const token = await user.getJWT(req);

            // Add the token to cookie and send the response back to the server
            res.cookie("token", token);
            res.send("Login Successfull!!")
        } else {
            throw new Error("Invalid credentials!! ")
        }
    }
    catch (err) {
        res.status(400).send('ERROR : ' + err)
    }
})

authRouter.get('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    req.send('Logout successfull');
})



module.exports = authRouter;