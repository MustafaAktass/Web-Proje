const mongoose = require('mongoose');

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

const announcementdata = new mongoose.Schema({
    DuyuruAdi: String,
    Kategori: String,
    Aciklama: String,
    Tarih: {
        type: String,
        default: getCurrentDateTime
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    resimler: [{
        dosyaYolu: String
    }],
    Yorumlar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'commentdatas' }]
});

module.exports = mongoose.model('announcementdatas', announcementdata);
