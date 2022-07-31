const mongoose = require('mongoose')
const { stringify } = require('nodemon/lib/utils')

// User schema for mongoose database 
const userSchema = new mongoose.Schema({
    firstname :{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required : true
    },
    username: {
        type: String,
        required : true
    },
    pass: {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
    join_date : {
        type : Date,
        default: () => Date.now(),
        immutable : true
    },
    bday : {
        type : Date
    },
    userPic : {
        type : String
    }
})
// to export the file to the serveur.js 
module.exports = mongoose.model('users',userSchema)