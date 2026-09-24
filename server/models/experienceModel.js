const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        default: ''
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
}, 
{ timestamps: true });

const Experience = mongoose.model('Experience', ExperienceSchema);
module.exports = Experience;