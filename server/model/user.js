const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },

    name:{
        type: String,
        require: true
    },

    email:{
        type: String,
        require: true
    },

    password:{
        type: String,
        require: true
    },

    incidentsId: {
        type: [],
        require: false
    }
})

module.exports = mongoose.model("User", userSchema)