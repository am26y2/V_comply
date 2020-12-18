const express= require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const {check,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs")
const userModel = require("../models/userModel");
const auth=require('./../middlewares/auth')

// Private Router, Logged In Users can Access it
router.get('/',auth,async (req,res)=>{
    try{
const user=await userModel.findById(req,user.id).select('-password');
    res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).send({msg:'server Error'})
    }
});

router.post('/',[
    check('email','Please enter Valid Email').isEmail(),
    check('password','Please enter vaild Password ').exists()
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}=req.body;
    try{
        let user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({msg:"User not found with Provided Email"});
        }
        const checkPassword=await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return res.status(400).json({msg:"Wrong Password"});
        }
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

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports=router;