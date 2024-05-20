const upload = require("../../middleware/fileUpload")
const ShopData = require("../../model/shopdata")
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
                // res.json(savedShop);
                res.redirect('/admin/add-industrial-shop');
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
exports.deleteIndustrialShop = async (req, res, next) => {
    try {
        const data = await ShopData.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).send('İşletme bulunamadı veya zaten silinmiş');
        }
        res.redirect('/admin/list-industrial-shop');
    } catch (err) {
        return res.status(500).send(`İşletme silinirken bir hata oluştu: ${err.message}`);
    }
}
exports.editIndustrialShop = async (req, res, next) => {
    try {
        const data = await ShopData.findById(req.params.id);
        if (!data) {
            return res.status(404).send('İşletme bulunamadı');
        }
        res.render('admin/edit-industrial-shop', { shopdata: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.updateIndustrialShop = async (req, res, next) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Dosya yükleme hatası: ' + err.message });
            } else {
                const { IsletmeAdi, Kategori, Adres, IletisimBilgileri, Sehir, Aciklama } = req.body;

                // Mevcut işletmeyi al
                const existingShop = await ShopData.findById(req.params.id);
                if (!existingShop) {
                    return res.status(404).send('İşletme bulunamadı');
                }

                // Yüklenen dosyalar varsa dosya yollarını alıp resimler dizisine ekle
                let resimler;
                if (req.files && req.files.length > 0) {
                    resimler = req.files.map(file => {
                        return { dosyaYolu: file.path };
                    });
                } else {
                    // Yeni resim yüklenmemişse eski resimleri kullan
                    resimler = existingShop.resimler;
                }

                // İşletmeyi güncelle
                const updatedShop = await ShopData.findByIdAndUpdate(req.params.id, {
                    IsletmeAdi,
                    Kategori,
                    Adres,
                    IletisimBilgileri,
                    Sehir,
                    Aciklama,
                    resimler: resimler
                }, { new: true });

                if (!updatedShop) {
                    return res.status(404).send('İşletme güncellenemedi');
                }

                res.redirect('/admin/list-industrial-shop');
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
