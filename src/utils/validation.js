const validator = require('validator');

const ValidateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password!")
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];
    const isEditAllowed = Object.keys(req.body).every(fields => allowedEditFields.includes(fields));
    return isEditAllowed;
}

module.exports = { ValidateSignupData, validateProfileEditData};