const mongoose = require("mongoose")

const { Schema } = mongoose

const company = new Schema({

    email: {

        type: String,
        required: true
    },
    company: {
        
        type: String,
        required: true,
    },
    fName: {

        type: String,
        required: true,
    },
    lName: {

        type: String,
        required: true,
    },
    number: {
        
        type: String,
        required: true,
    },
    createdAt: {
      
        type: Date,
        default: Date.now
    },

})


const compDetai = mongoose.model("companyDetails", company);
module.exports = compDetai;
