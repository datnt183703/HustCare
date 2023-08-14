const mongoose = require('mongoose')
const Schema = mongoose.Schema

const countvisitor =new Schema({
    id: String,
    count: Number,
}, {
    timestamps: true,
})

module.exports = mongoose.model('countvisitor', countvisitor)
