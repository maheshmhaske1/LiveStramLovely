const mongoose = require('mongoose')
require('dotenv').config()

exports.dbConnection = async () => {
    mongoose.connect(process.env.DATABASE_LOCAL, (error) => {
        if (!error) {
            console.log('Connected with MongoDB...')
        }
        else {
            console.log('error while connecting...', error)
        }
    })
}
