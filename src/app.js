const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
const { ValidateSignupData } = require("./utils/validation")
const bcypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const userAuth = require('./middlewares/auth')
app.use(cookieParser())
app.use(express.json());

app.post('/signup', async (req, res) => {
    try {

        // validation of data 
        ValidateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcypt.hash(password, 10);
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
app.post('/login', async (req, res) => {
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

app.get('/feed', async (req, res) => {

    try {
        const allUsers = await User.find({});
        res.send(allUsers);
    }
    catch (err) {
        res.status(400).send('Error saving the user:' + err.Message)
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;

    try {
        const getUserId = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully!!');
    }
    catch (err) {
        res.status(400).send('Error deleting the user:' + err.Message)
    }
})

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error('Update not allowed');
        }
        if (data.skills.length > 10) {
            throw new Error('Skills can not be more then 10')
        }
        const getUserId = await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true,
        });
        res.send('User updated successfully!!');
    }
    catch (err) {
        res.status(400).send('Something went wrong:' + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        // The user object is now available on req.user thanks to the middleware
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
});

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send('User not found!!')
        } else {
            res.send(users)
        }
    }
    catch {
        console.log('Something went wrong!!')
    }

})

app.post('/sendConnectionRequest', userAuth, async (req, res)=> {


    const user = req.user;

    res.send('Coonected by !!' + ' ' + user.firstName)
})

connectDb().then(() => {
    console.log('Database connection stablished!!')
    app.listen(3000, () => {
        console.log('Server is successfully listening on port 3000');
    });
}).catch((error) => {
    console.log('Database con not be connected')
})
