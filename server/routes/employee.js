const express=require('express');
const { route } = require('./users');
const router=express.Router();
const {check,validationResult}=require("express-validator");
const userModel = require("../models/userModel");
const EmpModel = require("../models/EmployeeModel");
const auth=require('./../middlewares/auth');
const { update } = require('../models/userModel');

//show all Employee
router.get('/',auth,async (req,res)=>{
    try {
        const employee=await EmpModel.find({user:req.user.id}).sort({date:-1}) //Des order
        res.json(employee);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
})

//Save Employee
router.post('/',[
auth,
check('name','Name is required').not().isEmpty(),
check('email',"Please enter valid Email").isEmail(),
check('designation','Please Enter Designation').not().isEmpty()
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({erors:errors.array()})
    }
    const {name,email,phone,designation,salary}=req.body;
    try {
        const newEmp=new EmpModel({
            name,
            email,
            phone,
            designation,
            salary,
            user:req.user.id
        });
        const saveepm=await newEmp.save();
        res.json(saveepm); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error");
    }
})

//Edit Employee

router.put('/:id',auth,async (req,res)=>{
    const {name,email,phone,designation,salary}=req.body;
    const empfields={};
    if(name) empfields.name=name;
    if(email) empfields.email=email;
    if(designation) empfields.designation=designation;
    if(phone) empfields.phone=phone;
    try {
        let employee=await EmpModel.findById(req.params.id);
        if(!employee)
        {
            return res.status(404).json({msg:"Employee not found"})
        }
        employee=await EmpModel.findByIdAndUpdate(re.params.id),{
            $set:empfields
        },{new:true}
        res.json(employee);
    } catch (error) { 
        console.group(error.message);
        res.status(500).send("Server Error");
    }
})

//Delete Empolyee

router.delete('/',auth,(req,res)=>{
    res.send("");
     
})

module.exports=router;