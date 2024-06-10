const express = require('express')
const path = require('path')
const ejslayouts=require('express-ejs-layouts')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser');
const mongoDbConnect = require('./db/mongoDb');
const authRouter = require('./routes/auth')
const dotenv = require('dotenv');
const cookiParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const createSitemap = require('./middleware/siteMap'); // Eklediğiniz sitemap middleware


dotenv.config();

const app = express()
const server = http.createServer(app);
const io = socketIo(server);

// Veri tabanı bağlantısı
const connect = mongoDbConnect;

// Ziyaretçi Modeli
const Visitor = mongoose.model('Visitor', new mongoose.Schema({
    url: String,
    timestamp: { type: Date, default: Date.now }
}));

let onlineUsers = 0;

io.on('connection', (socket) => {
    // Kullanıcının belirli bir URL'de olduğunu kontrol etmek için bir özelliği saklayın
    socket.on('page', (page) => {
        if (page.startsWith('/user')) {
            onlineUsers++;
            io.emit('onlineUsers', onlineUsers);

            socket.on('disconnect', () => {
                onlineUsers--;
                io.emit('onlineUsers', onlineUsers);
            });
        }
    });
});

app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/user')) {
        const newVisitor = new Visitor({ url: req.originalUrl });
        newVisitor.save().then(() => next());
    } else {
        next();
    }
});

app.get('/admin/visitors', async (req, res) => {
    const totalVisitors = await Visitor.countDocuments({ url: { $regex: '^/user' } });
    res.json({ totalVisitors });
});

app.set('view engine', 'ejs')
app.use(ejslayouts)
app.set('layout', 'layouts/layout');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookiParser())

app.use('/static', express.static(path.join(__dirname, 'public/template')));
app.use('/userstatic', express.static(path.join(__dirname, 'public/userTemplate/html')));
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/admin', adminRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)

app.get('/sitemap.xml', createSitemap);

app.use('*', (req, res) => {
    res.status(404).render('./admin/404', {
        layout: false
    });
})

server.listen(3000, () => {
    console.log('server running');
})
