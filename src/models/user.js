const mongoose = require('mongoose');
const validator = require("validator")

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

const userModal = mongoose.model('User', userSchema); // ('name of modal', 'schema itself')

module.exports = userModal;