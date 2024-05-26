const upload = require("../../middleware/fileUpload")
const AnnouncementData = require("../../model/announcementdata")
const User = require("../../model/user")

function getCurrentDateTime() {
    // Bugünün tarihini ve saatini al
    const now = new Date();

    // Tarih formatı: Gün/Ay/Yıl
    const date = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();

    // Saat formatı: Saat:Dakika:Saniye
    const time = now.getHours() + ':' + now.getMinutes();

    // Tarih ve saat stringlerini birleştir
    const dateTime = date + ' ' + time;

    // Birleştirilmiş stringi return et
    return dateTime;
}

exports.processAnnouncement = async(req,res)=>{
    try{
    upload(req,res,async(err)=>{
        if(err){
            return res.status(400).json({ message: 'Dosya yükleme hatası: ' + err.message });
        }
        else{
            const { DuyuruAdi, Kategori, Aciklama } = req.body;
                
                // Yüklenen her dosya için dosya yollarını alıp resimler dizisine ekleyelim
                const resimler = req.files.map(file => {
                    return { dosyaYolu: file.path };
                });

                const data = new AnnouncementData({
                    DuyuruAdi,
                    Kategori,
                    Aciklama,
                    Tarih:getCurrentDateTime(),
                    resimler: resimler // Resimleri modele ekleyelim
                });

                const savedAnnouncement = await data.save();
                // res.json(savedShop);
                res.redirect('/admin/add-announcement');
        }
    })}
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

exports.addAnnouncement=async(req,res,next)=>{
    const userRole = req.user.role;
    const user = await User.findById(req.user.userId);
    const userName = user.name;
    res.render('admin/add-announcement',{
        userName,
        userRole
    })
}
exports.listAnnouncement= async (req,res,next)=>{
    const userRole = req.user.role;
    const user = await User.findById(req.user.userId);
    const userName = user.name;
    try{
        const data = await AnnouncementData.find();
        res.render('admin/list-announcement', { 
            announcementdata : data,
            userName,
            userRole
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const data = await AnnouncementData.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).send('Duyuru bulunamadı veya zaten silinmiş');
        }
        res.redirect('/admin/list-announcement');
    } catch (err) {
        return res.status(500).send(`Duyuru silinirken bir hata oluştu: ${err.message}`);
    }
}
exports.displayAnnouncement = async (req, res, next) => {
    const userRole = req.user.role;
    const user = await User.findById(req.user.userId);
    const userName = user.name;
    try {
        const data = await AnnouncementData.findById(req.params.id);
        if (!data) {
            return res.status(404).send('Duyuru bulunamadı');
        }
        res.render('admin/display-announcement', { 
            announcementdata: data,
            userRole,
            userName 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.updateAnnouncement = async (req, res, next) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Dosya yükleme hatası: ' + err.message });
            } else {
                const { DuyuruAdi, Kategori, Aciklama } = req.body;

                // Mevcut duyuruyu al
                const existingAnnouncement = await AnnouncementData.findById(req.params.id);
                if (!existingAnnouncement) {
                    return res.status(404).send('Duyuru bulunamadı');
                }

                // Yüklenen dosyalar varsa dosya yollarını alıp resimler dizisine ekle
                let resimler;
                if (req.files && req.files.length > 0) {
                    resimler = req.files.map(file => {
                        return { dosyaYolu: file.path };
                    });
                } else {
                    // Yeni resim yüklenmemişse eski resimleri kullan
                    resimler = existingAnnouncement.resimler;
                }

                // Duyuruyu güncelle
                const updatedAnnouncement = await AnnouncementData.findByIdAndUpdate(req.params.id, {
                    DuyuruAdi,
                    Kategori,
                    Aciklama,
                    Tarih: getCurrentDateTime(),
                    resimler: resimler
                }, { new: true });

                if (!updatedAnnouncement) {
                    return res.status(404).send('Duyuru güncellenemedi');
                }

                res.redirect('/admin/list-announcement');
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
