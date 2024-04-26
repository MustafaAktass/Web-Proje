const data = require("../model/data")

exports.processIndustrialShop = (req,res)=>{
    const { IsletmeAdi, Kategori, Adres, IletisimBilgileri, Sehir, Aciklama } = req.body;
    const newData = {
        IsletmeAdi,
        Kategori,
        Adres,
        IletisimBilgileri,
        Sehir,
        Aciklama
    };
    data.push(newData);
    res.json(data)
}
exports.homePage=(req,res,next)=>{
    res.render('admin/index')
}
exports.addIndustrialShop=(req,res,next)=>{
    res.render('admin/add-industrial-shop')
}
exports.listIndustrialShop=(req,res,next)=>{
    res.render('admin/list-industrial-shop',{data:data})
}