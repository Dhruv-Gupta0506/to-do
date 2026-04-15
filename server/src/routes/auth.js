const router=require('express').Router();
const User=require('../models/users');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const existingUser=await User.findOne({
            $or: [{email}, {username}]
        });
        if(existingUser){
            return res.status(400).json({error:'Email or username already in use'});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({
            username,
            email,
            password:hashedPassword
        });
        await user.save();
        res.status(201).json({message:'User created successfully'});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:'Invalid email or password'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({error:'Invalid email or password'});
        }
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge:3600000
        }).status(200).json({message:'Login successful',
            username:user.username,email:user.email
        });
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

router.post('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:false
    }).status(200).json({message:'Logout successful'});
});

module.exports=router;