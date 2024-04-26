const data = require('../model/data')

exports.homePage=(req,res,next)=>{
    res.render('admin/index')
}
exports.addIndustrialShop=(req,res,next)=>{
    res.render('admin/add-industrial-shop')
}
exports.listIndustrialShop=(req,res,next)=>{
    res.render('admin/list-industrial-shop')
}