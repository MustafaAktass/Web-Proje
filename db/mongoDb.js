const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://dbUser:dbUser123@webproje.zjgilqo.mongodb.net/?retryWrites=true&w=majority&appName=WebProje";
const mongoDbConnect = mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));
module.exports = mongoDbConnect;
