const bcrypt=require('bcrypt');

const User=require('../models/User');

const jwt= require('jsonwebtoken');

require('dotenv').config();

exports.signup=async (req,res)=>{

    try{
        //get data from body
        const {name,email,password,role}=req.body;

        //checking for existing user

        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.staus(500).json({
                success:false,
                message:'There is an existing user',
            });
        }

        let hashedpassword;
        try{
            hashedpassword=await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
            success:false,
            message:'password cannot be hashed',
            });
}
        const user=await User.create({
            name,email,password:hashedpassword,role
        })
        return res.status(200).json({
        success:true,
        message:'The user is created successfully',
        });
}
catch(error){
    console.error(error);
        return res.status(500).json({
            success:false,
            message:'There was an error in creating new user',
        });
    } 
};


//login

exports.login= async (req,res)=>{


    try{

        //get data from req

        const {email,password}=req.body;

        //check whether it is empty or not

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'please enter correct email or password',

            });
        }
        
        //find one email which match the user

        const user = await User.findOne({email});

        //if email does not match
        if(!user){
            return res.status(400).json({
                success:false,
                message:'please enter correct mail',
            });
        }

        //compare pasword if email matched
        if(await bcrypt.compare(password,user.password)){
            //creting a jwt token

            const payload={
                email:user.email,
                id:user._id,
                role:user.role,
            }

            const token=await jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })

            user.token=token;
            user.password=undefined;

            //creting a new cookie

        const option={
            expires:new Date(Date.now()+24*60*60*1000),
            httpOnly:true,
}

            res.cookie("newcookie",token,option).status(500).json({
                success:true,
                message:'user logged in successfully',
                token,
                user,
            })
        }
        //if password does not matched
        else{
            return res.status(500).json({
                success:false,
                message:'please enter correct password',
            }); 
        }
    }
   catch(error){
    console.log(error);

    return res.status(500).json({
        success:false,
        message:'The user cannot be fined out successfully',

    })

   }

}