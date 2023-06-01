const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    photo: {
        type: String
    },
    about: {
        type: String
    },
    dob: {
        type: Date,
    },
    mobile: {
        type: Number,
        default: ''
    },
    gender: {
        type: Number,
    },
    token: {
        type: String
    },

})


var userModel = mongoose.model('users', userSchema);
module.exports = userModel;