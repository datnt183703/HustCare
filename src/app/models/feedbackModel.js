const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedbacks=new Schema({
    username: String,
    userrole: Number, 
    title: String,
    content: String,
    rate: String,
}, {
    timestamps: true,
})

module.exports = mongoose.model('feedbacks', feedbacks)
