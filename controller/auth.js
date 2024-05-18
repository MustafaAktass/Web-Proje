const collection = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginPage=(req,res,next)=>{
    res.render('auth/login')
}
exports.registerPage=(req,res,next)=>{
    res.render('auth/register')
}
exports.register= async(req,res,next)=>{
    const data = {
        email:req.body.email,
        name: req.body.username,
        password: req.body.password
    }
    //kullanıcının önceden kayıtlı olup olmadığının kontrolü
    const existingUser = await collection.findOne({name: data.name});
    if(existingUser){
        res.send("Bu kullanıcı adı kullanılmaktadır. Lütfen başka kullanıcı adı giriniz.")
    }
    else{
        //password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password,saltRounds);
        data.password =hashedPassword;

        const userdata  = await collection.insertMany(data);
        console.log(userdata);
    }
    //res.render('auth/register')
}
exports.login=async(req,res,next)=>{
    try{
        const check = await collection.findOne({name:req.body.username});
        if(check){
            const isPasswordMatch = await bcrypt.compare(req.body.password,check.password);
            if(isPasswordMatch){
                const token = createToken(check._id)
                res.cookie("cookieJWT",token,{
                    httpOnly:true,
                    maxAge:1000*60*60*24
                })
                res.redirect('/admin');
            }
            else{
                res.send("Kullanıcı adı veya şifre hatalı");
            }
        }
    }
    catch{
         res.send("Hatalı Giden Bir Şeyler Oldu")
    }
}

const createToken = (userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"1d",
    });
}