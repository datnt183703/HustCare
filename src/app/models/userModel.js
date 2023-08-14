const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users=new Schema({
    account: {type: String, unique: true},
    password: String,
    name: String, 
    age: Number,
    phone: String,
    gender: String,
    address: String,
    role: Number,
    description: String,
    origin: String,
    email: String,
    stt: String,
}, {
    timestamps: true,
})

module.exports = mongoose.model('users', users)
