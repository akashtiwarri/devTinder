const express = require('express');
const userAuth = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        // The user object is now available on req.user thanks to the middleware
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile was updated successfully`)
    }
    catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

module.exports = profileRouter;