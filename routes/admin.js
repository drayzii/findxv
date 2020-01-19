const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
mongoose.set('useFindAndModify', false)
var API_KEY = '201d11e03bb81d3804cce248dc9ff3a4-0a4b0c40-b97ad0a8'
var DOMAIN = 'sandbox3bbc9be9da484e75b36c4731fba6788a.mailgun.org'
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN})

const Nataye = require('../models/nataye')
const Natoraguye = require('../models/natoraguye')
const Ibyabonetse = require('../models/ibyabonetse')

const router = express.Router();

var elements = []   

router.get('/', (req, res)=>{
    if(req.auth){
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
    if(req.body.email==='fraterne01@gmail.com'&&req.body.password==='imbutotv123458'){
        res.cookie('token', jwt.sign('auth', 'OK'))
        res.redirect('ibyahujwe')
    } else{
        res.redirect('login?status=failed')
    }
})

router.get('/logout', (req, res)=>{
    res.cookie('token', '');
    res.redirect('login?status=logout')
})

router.get('/ibyatakaye', (req, res)=>{
    if(req.auth){
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
    if(req.auth){
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
    if(req.auth){
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
    if(req.auth){
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
    if(req.auth){
        const query = { icyangombwa: req.params.id }

        const update = {
            byemejwe: true
        }

        Natoraguye
        .findOneAndUpdate(query, update, { new: true })
        .then(results=>{
            const mailOptions = {
                from: 'RUGWIZANGOGA Fraterne <fraterne@ndarangisha.com>',
                to: results.email,
                subject: 'Icyangombwa watoraguye cyabonye nyiracyo',
                html: '<p>Murakoze gukoresha gahunda yacu ya mudasobwa yitwa NDARANGISHA. La fraternité Tech Ltd irabamenyesha ko icyangombwa mwatoraguye cyabonye nyiracyo. Hamagara 0788902758</p>'
            };
            mailgun.messages().send(mailOptions, function (error, body) {
                if(err){
                console.log(err)
                }
                else {
                    console.log(body)
                    Nataye
                    .findOne(query)
                    .then(results2=>{
                        const mailOptions = {
                            from: 'RUGWIZANGOGA Fraterne <fraterne@ndarangisha.com>',
                            to: results2.email,
                            subject: 'Icyangombwa cyawe cyabonetse',
                            html: '<p>Murakoze gukoresha gahunda yacu ya mudasobwa yitwa NDARANGISHA. La fraternité Tech Ltd irabamenyesha ko icyangombwa mwarangishije cyabonetse. Hamagara 0788902758</p>'
                        }
                        mailgun.messages().send(mailOptions, function (error, body) {
                            if(err){
                                console.log(error)
                            }
                            else{
                                console.log(body)
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
    if(req.auth){
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
    if(req.auth){
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
