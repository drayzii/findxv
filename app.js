const express = require('express')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mainRoute = require('./routes/main')
const adminRoute = require('./routes/admin')
const db = require('./dbConn').mongoURI
const mongoose = require('mongoose')
const Nataye = require('./models/nataye')
const Natoraguye = require('./models/natoraguye')
const Ibyabonetse = require('./models/ibyabonetse')

const app = express()

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Database Connected')
    })
    .catch((err) => {
            console.log(err)
    })

app.set('view engine', 'ejs')

app.use(express.static('views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(fileupload({
    useTempFiles: true
}))
app.use(cookieParser());

app.get('/', (req, res)=>{
    if(req.query.status){
        res.render('index', {
            status: req.query.status
        })
    } else{
        res.render('index', {
            status: 'welcome'
        })
    }
})
app.get('/ibyatakaye', (req, res)=>{
    Nataye.find()
        .then(results=>{
            res.render('ibyatakaye', {
                results
            })
        })
})
app.get('/ibyatoraguwe', (req, res)=>{
    Natoraguye.find()
        .then(results=>{
            res.render('ibyatoraguwe', {
                results
            })
        })
})
app.get('/ibyabonetse', (req, res)=>{
    Ibyabonetse.find()
        .then(results=>{
            res.render('ibyabonetse', {
                results
            })
        })
})
app.get('/en', (req, res)=>{
    if(req.query.status){
        res.render('en/index', {
            status: req.query.status
        })
    } else{
        res.render('en/index', {
            status: 'welcome'
        })
    }
})
app.get('/en/ibyatakaye', (req, res)=>{
    Nataye.find()
        .then(results=>{
            res.render('en/ibyatakaye', {
                results
            })
        })
})
app.get('/en/ibyatoraguwe', (req, res)=>{
    Natoraguye.find()
        .then(results=>{
            res.render('en/ibyatoraguwe', {
                results
            })
        })
})
app.get('/en/ibyabonetse', (req, res)=>{
    Ibyabonetse.find()
        .then(results=>{
            res.render('en/ibyabonetse', {
                results
            })
        })
})
app.use('/main', mainRoute)
app.use('/admin', (req, res, next) => {
    try {
        req.auth = jwt.verify(req.cookies.token, 'OK')
        next()
    } catch (error) {
        console.log(error)
        next()
    }
} ,adminRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{console.log(PORT)})