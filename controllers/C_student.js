const student = require("../models/M_student");
const attendance = require('../models/M_attendance');
const { catchRes, successRes, errorRes } = require("../res/msgcode");


const addStud = async(req,res)=>{

    try {
        
        const { name,rno }  = req.body;
    
        if (!rno) {
            return errorRes(res, 400, "rno number is required");
        } if (!/^\d+$/.test(rno)) {
            return errorRes(res, 400, "rno is not valid");
        }
    
        if (!name) {
            return errorRes(res, 400, "Name is required");
        } if (name.length < 3) {
            return errorRes(res, 400, "Name must contain at least 3 characters");
        }if (!/^[a-zA-Z]+$/.test(name)) {
            return errorRes(res, 400, "Only characters are allowed in the name");
        }  
        if (/\s/.test(name)) {
            return errorRes(res, 400, "The name must not contain space");
        } 
    
        const checkAvlRno = await student.find({rno:rno});
    
        if(checkAvlRno.length > 0){
            return errorRes(res, 400, "rno already exist");
        }
    
        const insert_data = {
            rno:rno,
            name:name,
        }
    
        const res_add = new student(insert_data);
    
        res_add.save()
            .then(async(result) => {
                await attendance.create({studId:res_add._id,rno:rno});
                return successRes(res, 201, "student is added Sucessfully.",res_add);
            })
            .catch((error) => {
                console.log("Error >>>>> ", error.message);
                return errorRes(res, 500, "Some Internal Error");
        });
    } catch (error) {
        console.log("Error from the add student >>",error);
        return errorRes(res,500,"some internal error")
    }



}

const getStud = async(req,res)=>{
    try {
        const studData = await student.find({isDelete:false},{isDelete:0,__v:0})
        if(studData.length > 0){
            return successRes(res,200,"student data is fetched successfully",studData)
        }
    } catch (error) {
        console.log("Error from the getStud >>",error);
        return errorRes(res,500,"some internal error")
    }
}

const removeStud = async(req,res)=>{
    try {
        const id = req.query.id;

        if(!id){
            return errorRes(res,400,"please provide the id")
        }

        const findIdStud = await student.find({_id:id,isDelete:false});

        if(findIdStud.length == 0){
            return errorRes(res,404,"student not found")
        }

        await student.findByIdAndUpdate({_id:id},{$set:{isDelete:true}});

        return successRes(res,200,"Student is removed successfully");

    } catch (error) {
        console.log("Error from the getStud >>",error);
        return errorRes(res,500,"some internal error")
    }
}

const editStud = async(req,res)=>{
    try {
        if(req.body.id == ''){
            return errorRes(res,400,"please provide the id")
        }

        console.log(req.body.id);

        const findIdStud = await student.find({_id:req.body.id});

        if(findIdStud.length == 0){
            return errorRes(res,404,"student not found")
        }

        await student.findByIdAndUpdate({ _id: req.body.id }, {...req.body}, { new: true });

        return successRes(res,200,"student is edit succcesssfully.")
    } catch (error) {
        console.log("Error from the getStud >>",error);
        return errorRes(res,500,"some internal error")
    }
}

module.exports = {
    addStud,
    getStud,
    removeStud,
    editStud
}