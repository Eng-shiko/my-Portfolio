const mongoose = require('mongoose');
const BioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    aboutText: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String,
        required: false
    },
    github: {
        type: String,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    }
}, { 
    timestamps: true 
});
const Bio = mongoose.model('Bio', BioSchema);
module.exports = Bio;