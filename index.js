const express = require('express')
const path = require('path')
const app = express()
const ejslayouts=require('express-ejs-layouts')
app.set('view engine', 'ejs')
const adminRouter = require('./routes/admin')

app.use(ejslayouts)

app.use('/admin',adminRouter)

app.use('/static',express.static(path.join(__dirname,'public/template')));

app.use(express.static(path.join(__dirname,'node_modules')))

app.listen(3000,()=>{
    console.log('server running');
})