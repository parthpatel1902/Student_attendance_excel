const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    rno:{
        type:Number,
    },
    isDelete:{
        type:Boolean,
        default:false
    }
})

const student = new mongoose.model('student',studentSchema);

module.exports = student;