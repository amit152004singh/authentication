const express=require('express');
const router=express.Router();

const {login,signup}=require("../controllers/auths")

const {auth,isStudent,isAdmin}=require("../middlewares/middle");

router.post('/login',login);

router.post('/signup',signup);

router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:'welcome to the protected route for student',
    });
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:'welcome to the protected route for admin',
    });
})
module.exports=router;