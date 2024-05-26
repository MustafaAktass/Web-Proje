const mongoose = require('mongoose');

const announcementdata = new mongoose.Schema({
    DuyuruAdi: String,
    Kategori: String,
    Aciklama: String,
    Tarih: String,
    resimler: [{
        dosyaYolu: String
    }],
    Yorumlar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'commentdatas' }]
});

module.exports = mongoose.model('announcementdatas', announcementdata);
