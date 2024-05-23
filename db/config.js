const mongoose = require('mongoose');

const conn = mongoose.connect("mongodb://127.0.0.1:27017/student_attendance").then(()=>{
    console.log("Database connected..");
}).catch((err)=>{
    console.log(`Some Error In connection : ${err}`);
});

module.exports = conn;