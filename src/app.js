const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
app.use(express.json());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send('User added successfully!!')
    }
    catch (err) {
        res.status(400).send('Error saving the user:' + err)
    }
})

app.get('/feed', async (req, res) => {

    try{
        const allUsers = await User.find({});
        res.send(allUsers);
    }
    catch (err) {
        res.status(400).send('Error saving the user:' + err.Message)
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    
    try{
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
    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error('Update not allowed');
        }
        if(data.skills.length > 10){
            throw new Error('Skills can not be more then 10')
        }
        const getUserId = await User.findByIdAndUpdate({_id : userId}, data, {
            runValidators : true,
        });
        res.send('User updated successfully!!');
    }
    catch (err) {
        res.status(400).send('Something went wrong:' + err.message)
    }
})

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if(users.length === 0){
            res.status(404).send('User not found!!')
        }else {
            res.send(users)
        }
    }
    catch {
        console.log('Something went wrong!!')
    }

})

connectDb().then(() => {
    console.log('Database connection stablished!!')
    app.listen(3000, () => {
        console.log('Server is successfully listening on port 3000');
    });
}).catch((error) => {
    console.log('Database con not be connected')
})
