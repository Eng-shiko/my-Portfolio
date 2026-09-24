const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    technology: {
        type: [String],
        required: true
    },
    githubUrl: {
        type: String,
        required: true
    },
    liveUrl: {
        type: String,
        required: true
    }
}, { 
    timestamps: true
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;