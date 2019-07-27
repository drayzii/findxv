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

var data = []   

router.post('/login', (req, res)=>{
    if(req.body.email==='fraterne01@gmail.com'&&req.body.password==='fraterne123458'){
        isVerified = true
        res.status(200).json({
            status: 200,
            message: 'Successfully logged in'
        })
    } else{
        res.status(403).json({
            status: 403,
            error: 'Forbidden Route'
        })
    }
})

router.patch('/logout', (req, res)=>{
    isVerified = false
    res.status(200).json({
        status: 200,
        message: 'Successfully logged out'
    })
})

router.get('/ibyatawe', (req, res)=>{
    if(isVerified == true){
        Nataye.find()
            .then(result=>{
                if(result.length == 0){
                    res.status(200).json({ 
                        status: 200,
                        error: 'Nothing to show' })
                    res.end()
                }
                else{
                    res.status(200).json({
                        status: 200,
                        data: result
                    })
                    res.end()
                }
            })
    } else{
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

router.get('/ibyatoraguwe', (req, res)=>{
    if(isVerified == true){
        Natoraguye.find()
            .then(result=>{
                if(result.length == 0){
                    res.status(200).json({ 
                        status: 200,
                        error: 'Nothing to show' })
                    res.end()
                }
                else{
                    res.status(200).json({
                        status: 200,
                        data: result
                    })
                    res.end()
                }
            })
    } else{
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

router.get('/ibyahujwe', (req, res)=>{
    if(isVerified == true){
        Nataye.find()
        .then((results)=>{
            results.forEach(result => {
                Natoraguye.findOne({ icyangombwa: result.icyangombwa })
                .then(result2=>{
                    if(result2){
                        data.push({
                            icyatawe: result,
                            icyatoraguwe: result2,
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
            return data
        })
        .then((data)=>{
            if(data.length != 0){
                res.status(200).json({
                    status: 200,
                    data
                })
            } else{
                res.status(200).json({ 
                    status: 200,
                    error: 'Nothing to show'
                })
                res.end()
            }
        })
        .catch(error=>{
            res.status(500).json({
                status: 500,
                error
            })
        })
    } else{
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

router.get('/ibyabonetse', (req, res)=>{
    if(isVerified == true){
        Ibyabonetse.find()
            .then(result=>{
                if(result.length == 0){
                    res.status(200).json({ 
                        status: 200,
                        error: 'Nothing to show' })
                    res.end()
                }
                else{
                    res.status(200).json({
                        status: 200,
                        data: result
                    })
                    res.end()
                }
            })
    } else{
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

router.patch('/kwemeza/:id', (req, res)=>{
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
                subject: 'Icyangombwa watoye cyabonye nyiracyo',
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
                                res.status(202).json({
                                    status: 202,
                                    message: 'Successfully sent emails to the concerned parties'
                                })
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
                                        .then(()=>{
                                            data = []
                                            res.status(202).json({
                                                status: 202,
                                                data: result3,
                                                message: 'Successfully sent emails to the concerned parties'
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
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

router.delete('/ibyatawe/:id', (req, res)=>{
    if(isVerified == true){
        Nataye
        .findByIdAndDelete(req.params.id)
        .then((result)=>{
            res.status(202).json({
                status: 202,
                data: result,
                message: 'Successfully deleted'
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
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

router.delete('/ibyatoraguwe/:id', (req, res)=>{
    if(isVerified == true){
    Natoraguye
    .findByIdAndDelete(req.params.id)
    .then((result)=>{
        res.status(202).json({
            status: 202,
            data: result,
            message: 'Successfully deleted'
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
        res.status(403).json({
            status: 403,
            error: 'Forbidden route'
        })
    }
})

module.exports = router