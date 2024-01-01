const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.auth= (req,res,next)=>{

try{
const token=req.body.token;

if(!token){
    return res.status(401).json({
        success:false,
        message:'please send correct token',
    })
}
try{
const payload=jwt.verify(token,process.env.JWT_SECRET);

res.user=payload;
}
catch(error){
return res.status(401).json({
    success:false, 
    message:'there was an error in the token',
})
}
next();
}
catch(error){
console.log(error);
return res.status(500).json({
    success:false,
    message:'you are not an authorised user',
})
}
}

exports.isStudent=(req,res,next)=>{

    try{
        if(res.user.role!==Student){
            return res.status(401).json({
                success:false,
                message:'you are not an authorised user',
            })
        }
        next();
    }
    catch(error){
        console.log(error);

        return res.status(401).json({
            success:false,
            message:'There was an error in authorization sorry',
        })
    }
}


exports.isAdmin=(req,res,next)=>{

    try{
        if(res.user.role!==Admin){
            return res.status(401).json({
                success:false,
                message:'you are not an authorised user',
            })
        }
        next();
    }
    catch(error){
        console.log(error);

        return res.status(401).json({
            success:false,
            message:'There was an error in authorization sorry',
        })
    }
}