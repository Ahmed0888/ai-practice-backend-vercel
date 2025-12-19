const mongoose = require("mongoose")

const { Schema } = mongoose

const saveResume = new Schema({

    email: {

        type: String,
        required: true
    },
    resumeText: {
        
        type: String,
        required: true,
    },
    createdAt: {
        
        type: Date,
        default: Date.now
    },
})


const saveResumes = mongoose.model("Resume", saveResume);
module.exports = saveResumes;
