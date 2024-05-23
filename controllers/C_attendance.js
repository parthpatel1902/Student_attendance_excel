const student = require("../models/M_student");
const attendance = require('../models/M_attendance');
const { successRes, errorRes } = require("../res/msgcode");
const {isValidDate} = require("../validation/dateValidate");
const { createObjectCsvWriter } = require('csv-writer');

const addAttendance = async(req,res)=>{
    try {
        const { rno,date,atten } = req.body;

        if (!rno) {
            return errorRes(res, 400, "rno number is required");
        } if (!/^\d+$/.test(rno)) {
            return errorRes(res, 400, "rno is not valid");
        }

        const checkAvlRno = await student.find({rno:rno});
        if(checkAvlRno.length === 0){
            return errorRes(res, 400, "rno is not exist");
        }

        if(!date){
            return errorRes(res, 400, "date is required");
        }
        const resValidDate = await isValidDate(date);
        if(resValidDate){
            return errorRes(res, 400, resValidDate);
        }

        const checkDateAvl = await attendance.findOne({ 
            studId: checkAvlRno[0]._id,
            'attendance.date': new Date(date) 
        });

        if(checkDateAvl !== null){
            return errorRes(res, 400, "attendance is already exist");
        }

        if(!atten){
            return errorRes(res, 400, "attendance is required");
        }

        const insert_data = {
            date: new Date(date),
            attendance:atten
        }

        const result = await attendance.updateOne(
            { studId: checkAvlRno[0]._id },
            { $push: { attendance: insert_data } }
        );

        return successRes(res, 200, "attendance added successfully");

    } catch (error) {
        console.log("Error from the addattendance >>",error);
        return errorRes(res,500,"some internal error")
    }
}

const getAttendance = async (req, res) => {
    try {
        if (!req.body.startDate) {
            return errorRes(res, 400, "Please provide the startDate");
        }

        const resValidDate = await isValidDate(req.body.startDate);
        if(resValidDate){
            return errorRes(res, 400, resValidDate);
        }

        const startDate = new Date(req.body.startDate);
        let endDate;

        if (!req.body.endDate) {
            endDate = new Date(); // Use current date if endDate is not provided
        } else {
            const resValidDate1 = await isValidDate(req.body.endDate);
            if(resValidDate1){
                return errorRes(res, 400, resValidDate1);
            }
            endDate = new Date(req.body.endDate);
        }

        if (startDate > endDate) {
            return errorRes(res, 400, "startDate cannot be greater than endDate");
        }

        const students = await student.find({ isDelete: false });

        const attendanceData = [];

        // Extracting all dates between startDate and endDate
        const allDates = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            allDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        for (const student of students) {
            const attendanceRecords = await attendance.findOne({
                studId: student._id,
                'attendance.date': { $gte: startDate, $lte: endDate },
                isDelete: false
            });

            const studentAttendance = {
                rno: student.rno,
                name: student.name
            };

            if (attendanceRecords) {
                attendanceRecords.attendance.forEach(record => {
                    const recordDate = new Date(record.date);
                    if (recordDate >= startDate && recordDate <= endDate) {
                        const formattedDate = recordDate.toISOString().split('T')[0];
                        studentAttendance[formattedDate] = record.attendance;
                    }
                });
            }

            allDates.forEach(date => {
                if (!studentAttendance[date]) {
                    studentAttendance[date] = '';
                }
            });

            attendanceData.push(studentAttendance);
        }

        // Generating CSV header dynamically
        const csvHeader = [
            { id: 'rno', title: 'Roll Number' },
            { id: 'name', title: 'Name' },
            ...allDates.map(date => ({ id: date, title: date }))
        ];

        // Generate CSV records with attendance data
        const csvRecords = attendanceData.map(record => {
            const csvRecord = {
                rno: record.rno,
                name: record.name
            };
            allDates.forEach(date => {
                csvRecord[date] = record[date] || ''; // If attendance is not available for a date, put blank cell
            });
            return csvRecord;
        });

        // Calculate total present and absent for each date
        const totalPresent = { rno: 'Total P :', name: '' };
        const totalAbsent = { rno: 'Total A :', name: '' };

        allDates.forEach(date => {
            let presentCount = 0;
            let absentCount = 0;

            attendanceData.forEach(record => {
                if (record[date] === 'p') {
                    presentCount++;
                } else if (record[date] === 'a') {
                    absentCount++;
                }
            });

            totalPresent[date] = presentCount.toString();
            totalAbsent[date] = absentCount.toString();
        });

        // Append totals to the CSV records
        csvRecords.push(totalPresent);
        csvRecords.push(totalAbsent);

        // Write CSV header and records to file
        const csvWriter = createObjectCsvWriter({
            path: 'attendance_records/attendance.csv',
            header: csvHeader
        });

        await csvWriter.writeRecords(csvRecords);

        return successRes(res, 200, "Attendance data has been exported to CSV file.");
    } catch (error) {
        console.log("Error from getAttendance:", error);
        return errorRes(res, 500, "Some internal error occurred");
    }
}





module.exports = {
    addAttendance,
    getAttendance
}