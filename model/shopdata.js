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

const shopdata = new mongoose.Schema({
    IsletmeAdi: String,
    Kategori: String,
    Adres: String,
    IletisimBilgileri: String,
    Sehir: String,
    Aciklama: String,
    olusturmaTarihi: {
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
    }]
});

module.exports = mongoose.model('shopData', shopdata);
