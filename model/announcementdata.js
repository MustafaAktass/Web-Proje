const mongoose = require('mongoose');

const announcementdata = new mongoose.Schema({
    DuyuruAdi: String,
    Kategori: String,
    Aciklama: String,
    Tarih: String,
    resimler: [{
        dosyaYolu: String
    }]
});

module.exports = mongoose.model('announcementdatas', announcementdata);
