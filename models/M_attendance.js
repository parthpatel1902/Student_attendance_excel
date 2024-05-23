const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studId:{
        type: mongoose.Schema.ObjectId,
        ref: "student"
    },
    rno:{
        type:Number,
    },
    attendance:{
        type:Array,
    },
    isDelete:{
        type:Boolean,
        default:false
    }
})

const attendance = new mongoose.model('attendance',attendanceSchema);

module.exports = attendance;