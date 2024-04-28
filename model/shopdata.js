const mongoose = require('mongoose');

const shopdata = new mongoose.Schema({
    IsletmeAdi: String,
    Kategori: String,
    Adres: String,
    IletisimBilgileri: String,
    Sehir: String,
    Aciklama: String,
    resimler: [{
        dosyaYolu: String
    }]
});

module.exports = mongoose.model('shopData', shopdata);
