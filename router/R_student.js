const express = require("express");
const router = new express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const studentController = require('../controllers/C_student');
const attendanceController = require('../controllers/C_attendance');


// ============================= student route =============================
router.post("/student",multipartMiddleware,studentController.addStud);
router.get("/student",studentController.getStud);
router.patch("/student",multipartMiddleware,studentController.editStud);
router.delete("/student",studentController.removeStud);
// =========================================================================


router.post("/attendance",multipartMiddleware,attendanceController.addAttendance);
router.post("/getattendance",multipartMiddleware,attendanceController.getAttendance);

module.exports = router;