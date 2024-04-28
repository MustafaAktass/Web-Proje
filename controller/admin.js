const upload = require("../middleware/fileUpload")
const ShopData = require("../model/shopdata")
exports.processIndustrialShop = async(req,res)=>{
    try{
    upload(req,res,async(err)=>{
        if(err){
            return res.status(400).json({ message: 'Dosya yükleme hatası: ' + err.message });
        }
        else{
            const { IsletmeAdi, Kategori, Adres, IletisimBilgileri, Sehir, Aciklama } = req.body;
                
                // Yüklenen her dosya için dosya yollarını alıp resimler dizisine ekleyelim
                const resimler = req.files.map(file => {
                    return { dosyaYolu: file.path };
                });

                const data = new ShopData({
                    IsletmeAdi,
                    Kategori,
                    Adres,
                    IletisimBilgileri,
                    Sehir,
                    Aciklama,
                    resimler: resimler // Resimleri modele ekleyelim
                });

                const savedShop = await data.save();
                res.json(savedShop);
        }
    })}
    catch(err){
        res.status(500).json({ message: err.message });
    }
}
exports.homePage=(req,res,next)=>{
    res.render('admin/index')
}
exports.addIndustrialShop=(req,res,next)=>{
    res.render('admin/add-industrial-shop')
}
exports.listIndustrialShop= async (req,res,next)=>{
    try{
        const data = await ShopData.find();
        res.render('admin/list-industrial-shop', { shopdata : data  });
    }
    catch (err) {
        res.status(500).json({ message: err.message }); 
    }
    
}