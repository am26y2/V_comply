const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const {check,validationResult}=require("express-validator");
const userModel = require("../models/userModel");
const bcrypt=require("bcryptjs")


router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','Please enter Valid Email').isEmail(),
    check('password','Please Enter Password With Min 6 or More Characters').isLength({
        min:6})
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password}=req.body;
    try{
        // if user already exists
        let user=await UserModel.findOne({email});
        if(user)
        {
            return res.status(400).json({msg:"User already exists with Email Provided"});
        }
        // if new user the save it
        user=new userModel({
            name,
            email,
            password
        } )
        // password convertingHash formate
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();
        const payload={
            user:{
                id:user.id
            }
        };
        jwt.sign(payload,process.env.SecretKey,{
            expiresIn:3600000
        },(err,token)=>{
            if(err) throw err;
            res.json({token}) ;
        })
    }catch(error)
    {}
}); 

module.exports=router;