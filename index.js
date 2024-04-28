const express = require('express')
const path = require('path')
const ejslayouts=require('express-ejs-layouts')
const adminRouter = require('./routes/admin')
const bodyParser = require('body-parser');
const mongoDbConnect = require('./db/mongoDb');

const app = express()

//veri tabanı bağlantısı
const connect = mongoDbConnect;
//veri tabanı bağlantısı

app.set('view engine', 'ejs')
app.use(ejslayouts)
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin',adminRouter)
app.use('/static',express.static(path.join(__dirname,'public/template')));
app.use(express.static(path.join(__dirname,'node_modules')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.listen(3000,()=>{
    console.log('server running');
})