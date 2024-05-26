const mongoose = require('mongoose');
const LoginSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
        }
})

const collection = new mongoose.model("users",LoginSchema)
module.exports = collection;