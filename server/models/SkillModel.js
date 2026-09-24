const mongoose = require('mongoose');
const SkillSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true
    },
    proficiency:{
        type:Number,
        required:true
    }
},{ 
    timestamps: true 
    })
const Skill =mongoose.model('Skills',SkillSchema);
module.exports=Skill