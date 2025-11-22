const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    userId:{
        type: String,
        require: true
    },

    description:{
        type: String,
        require: true
    },

    adress:{
        type: String,
        require: true
    },

    date:{
        type: Date,
        require: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Incident", incidentSchema);