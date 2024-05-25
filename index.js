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


dotenv.config();

const app = express()

//veri tabanı bağlantısı
const connect = mongoDbConnect;
//veri tabanı bağlantısı

app.set('view engine', 'ejs')
app.use(ejslayouts)
app.set('layout', 'layouts/layout');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookiParser())
app.use('/admin',adminRouter)
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/static',express.static(path.join(__dirname,'public/template')));//admin template
app.use('/userstatic',express.static(path.join(__dirname,'public/userTemplate/html')));
app.use(express.static(path.join(__dirname,'node_modules')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.listen(3000,()=>{
    console.log('server running');
})