const User = require('../model/user');
const jwt = require('jsonwebtoken')
const authenticateToken= async(req,res,next)=>{
    try{
        const token = req.cookies.cookieJWT;
        if(token){
         jwt.verify(token,process.env.JWT_SECRET,(err)=>{
             if(err){
                 console.log(err.message);
                 res.redirect("/auth/login")
             }
             else{
                 next()
             }
         })
        }
        else{
         res.redirect("/auth/login")
        }
    }
  catch(error){
    res.json({
         succeeded: false,
         error:"Not authorized"
    })
  }
}

module.exports = authenticateToken;