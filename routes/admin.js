const express = require('express')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const nodemailer = require('nodemailer')

const Nataye = require('../models/nataye')
const Natoraguye = require('../models/natoraguye')
const Ibyabonetse = require('../models/ibyabonetse')

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'fraterne01@gmail.com',
           pass: 'fraterne123458'
    }
})

var isVerified = false

var elements = []   

router.get('/', (req, res)=>{
    if(isVerified == true){
        res.redirect('ibyahujwe')
    } else{
        res.redirect('login')
    }
})

router.get('/login', (req, res)=>{
    if(req.query.status){
        res.render('admin/login', {
            status: req.query.status
        })
    } else{
        res.render('admin/login', {
            status: 'ok'
        })
    }
})

router.post('/login', (req, res)=>{
    if(req.body.email==='fraterne01@gmail.com'&&req.body.password==='fraterne123458'){
        isVerified = true
        res.redirect('ibyahujwe')
    } else{
        res.redirect('login?status=failed')
    }
})

router.get('/logout', (req, res)=>{
    isVerified = false
    res.redirect('login?status=logout')
})

router.get('/ibyatakaye', (req, res)=>{
    if(isVerified == true){
        Nataye.find()
            .then(results=>{
                res.render('admin/ibyatakaye', {
                    results
                })
            })
    } else{
        res.redirect('login?status=auth')
    }
})

router.get('/ibyatowe', (req, res)=>{
    if(isVerified == true){
        Natoraguye.find()
            .then(results=>{
                res.render('admin/ibyatowe', {
                    results
                })                
            })
    } else{
        res.redirect('login?status=auth')
    }
})

router.get('/ibyahujwe', (req, res)=>{
    if(isVerified == true){
        Natoraguye.find()
        .then((results)=>{
            results.forEach(result => {
                Nataye.findOne({ icyangombwa: result.icyangombwa })
                .then(result2=>{
                    if(result2){
                        elements.push({
                            icyatawe: result2,
                            icyatoraguwe: result,
                        })
                        
                    }
                })
                .catch(error=>{
                    res.status(500).json({
                        status: 500,
                        error
                    })
                })
            })
            let data = elements
            elements = []
            return data
        })
        .then((data)=>{
            res.render('admin/ibyahujwe', {
                data
            })
        })
        .catch(error=>{
            res.status(500).json({
                status: 500,
                error
            })
        })
    } else{
        res.redirect('login?status=auth')
    }
})

router.get('/ibyabonetse', (req, res)=>{
    if(isVerified == true){
        Ibyabonetse.find()
            .then(results=>{
                res.render('admin/ibyabonetse', {
                    results
                })
            })
    } else{
        res.redirect('login?status=auth')
    }
})

router.get('/kwemeza/:id', (req, res)=>{
    if(isVerified == true){
        const query = { icyangombwa: req.params.id }

        const update = {
            byemejwe: true
        }

        Natoraguye
        .findOneAndUpdate(query, update, { new: true })
        .then(results=>{
            const mailOptions = {
                from: 'fraterne01@gmail.com',
                to: results.email,
                subject: 'Icyangombwa watoraguye cyabonye nyiracyo',
                html: '<p>Murakoze gukoresha gahunda yacu ya mudasobwa yitwa NDARANGISHA. La fraternité Tech Ltd irabamenyesha ko icyangombwa mwatoraguye cyabonye nyiracyo. Hamagara 0788902758</p>'
            };
            transporter.sendMail(mailOptions, function (err) {
                if(err){
                console.log(err)
                }
                else {
                    Nataye
                    .findOne(query)
                    .then(results2=>{
                        const mailOptions = {
                            from: 'fraterne01@gmail.com',
                            to: results2.email,
                            subject: 'Icyangombwa cyawe cyabonetse',
                            html: '<p>Murakoze gukoresha gahunda yacu ya mudasobwa yitwa NDARANGISHA. La fraternité Tech Ltd irabamenyesha ko icyangombwa mwarangishije cyabonetse. Hamagara 0788902758</p>'
                        }
                        transporter.sendMail(mailOptions, function (err) {
                            if(err){
                                console.log(err)
                            }
                            else{
                                const newIbyabonetse = new Ibyabonetse({
                                    amazina: results2.amazina,
                                    ubwoko: results2.ubwoko,
                                    icyangombwa: results2. icyangombwa
                                })
                                newIbyabonetse.save()
                                .then(result3=>{
                                    Nataye
                                    .findByIdAndDelete(results2._id)
                                    .then(()=>{
                                        Natoraguye
                                        .findByIdAndDelete(results._id)
                                        .then(result4=>{
                                            res.send(`Email zoherejwe uwabuze n' uwatoraguye icyangombwa. Kanda back!`)
                                        })
                                        .catch((err)=>{
                                            res.status(500).json({ 
                                                status: 500,
                                                error: err
                                            })
                                            res.end()
                                        })
                                    })
                                    .catch((err)=>{
                                        res.status(500).json({ 
                                            status: 500,
                                            error: err
                                        })
                                        res.end()
                                    })
                                })
                                .catch((err)=>{
                                    res.status(500).json({ 
                                        status: 500,
                                        error: err
                                    })
                                    res.end()
                                })
                            }
                        })
                    })
                    .catch((err)=>{
                        res.status(500).json({ 
                            status: 500,
                            error: err
                        })
                        res.end()
                    })
                }
            })
        })
        .catch((err)=>{
            res.status(500).json({ 
                status: 500,
                error: err
            })
            res.end()
        })
    } else{
        res.redirect('login?status=auth')
    }
})

router.get('/ibyatakaye/delete/:id', (req, res)=>{
    if(isVerified == true){
        Nataye
        .findByIdAndDelete(req.params.id)
        .then(()=>{
            res.send('Byasibwe, kanda Back')
        })
        .catch((err)=>{
            res.status(500).json({ 
                status: 500,
                error: err
            })
            res.end()
        })
    } else{
        res.redirect('login?status=auth')
    }
})

router.get('/ibyatoraguwe/delete/:id', (req, res)=>{
    if(isVerified == true){
        Natoraguye
        .findByIdAndDelete(req.params.id)
        .then(()=>{
            res.send('Byasibwe, kanda Back')
        })
        .catch((err)=>{
            res.status(500).json({ 
                status: 500,
                error: err
            })
            res.end()
        })
    } else{
        res.redirect('login?status=auth')
    }
})

module.exports = router