const express = require('express');
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: 'Akash',
        lastName: 'Tiwari',
        emailId: 'akash@yopmail.com',
        password: '1234',
        age: '25',
        gender: 'male'
    }
    const user = new User(userObj);
    try {
        await user.save();
        res.send('User added successfully!!')
    }
    catch (err) {
        res.status(400).send('Error saving the user:' + err.Message)
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
