const mongoose = require("mongoose")

const { Schema } = mongoose

const jobs = new Schema({

    email: {

        type: String,
        required: true
    },
    jobTilte: {
        
        type: String,
        required: true,
    },
    jobLocation: {
        
        type: String,
        required: true,
    },
    jobTimeline: {
        
        type: String,
        required: true,
    },
    jobType: {
        
        type: String,
        required: true,
    },
    jobPay: {
        
        type: String,
        required: true,
    },
    quantityInput: {
        
        type: String,
        required: true,
    },
    description: {
        
        type: String,
        required: true,
    },
    createdAt: {
      
        type: Date,
        default: Date.now
    },
    
})


const job = mongoose.model("Jobs", jobs);
module.exports = job;
