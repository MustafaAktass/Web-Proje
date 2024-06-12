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

const CommentSchema = new mongoose.Schema({
    icerik: { type: String, required: true },
    yazar: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    tarih: { 
        type: String, 
        required: true,
        default: getCurrentDateTime
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'shopData', required: true }
});

module.exports = mongoose.model('shopCommentdatas', CommentSchema);
