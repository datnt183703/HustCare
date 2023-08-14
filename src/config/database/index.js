const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/web');
        console.log('connect databse success!!!')
    } catch (error) {
        console.log(error)
        console.log('connect failure!!!')
    }
}

module.exports = { connect }
