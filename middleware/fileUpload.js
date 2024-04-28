const fs = require("fs");
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');

//dosya yükleme
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads")
    },
    filename:function(req,file,cb){
        const uniqName = uuidv4();
        cb(null,file.fieldname+uniqName+file.originalname)
    }
})
const fileFilter =(req,file,cb)=>{
    cb(null,true);
}
const upload =multer({storage:storage,fileFilter:fileFilter}).array("files",5);
module.exports = upload
//dosya yükleme