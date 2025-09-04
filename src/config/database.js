const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://akashtiwarri:0fPSL9SDLPVgEhPM@devtinder.8p6fccl.mongodb.net/devTinder')
}

module.exports = connectDb;