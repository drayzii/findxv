const express = require('express')
const fileupload = require('express-fileupload')
const mainRoute = require('./routes/main')
const db = require('./dbConn').mongoURI
const mongoose = require('mongoose')

const app = express()

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Database Connected')
    })
    .catch((err) => {
            console.log(err)
    })

app.use(express.json())
app.use(fileupload({
    useTempFiles: true
}))

app.get('/', (req, res)=>{
    res.status(200).json({
        status: 200,
        message: 'Welcome to Ndarangisha'
    })
})
app.use('/main', mainRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{console.log(PORT)})