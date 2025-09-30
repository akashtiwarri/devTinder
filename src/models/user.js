const mongoose = require('mongoose');
const validator = require("validator");
const bcypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    }, 
    lastName : {
        type : String,
        required : true,
    }, 
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email: " + value)
            }
        }
    }, 
    password : {
        type : String,
        required : true,
    }, 
    age : {
        type : String
    }, 
    gender : {
        type : String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error('Gender data is not value')
            }
        }
    }, 
    photoUrl : {
        type : String,
        default : 'https://inovineconferences.com/uploads/dummy-user.png',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Url format is not valid: " + value)
            }
        }
    }, 
    about : {
        type : String,
        default : 'This is default value of the user!'
    }, 
    skills : {
        type : [String]
    }, 
}, {
    timestamps : true
})

userSchema.methods.getJWT = async function() {
    console.log('jwt function called')
    const user = this;

    // Use jwt.sign() to create a new token with the user's ID
    const token = jwt.sign({ _id: user._id.toString() }, "DEV@Tinder$1311", { expiresIn: '1d' });

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){

    const user = this;

    const passwordHash = user.password;
    const isPasswordValid = bcypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;

}

const userModal = mongoose.model('User', userSchema); // ('name of modal', 'schema itself')

module.exports = userModal;