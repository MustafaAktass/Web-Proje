const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    icerik: { type: String, required: true },
    yazar: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    tarih:{ type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'announcementdatas', required: true }
});

module.exports = mongoose.model('commentdatas', CommentSchema);
