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

var data = []   

router.get('/ibyatawe', (req, res)=>{
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
})

router.get('/ibyatoraguwe', (req, res)=>{
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
})

router.post('/ibyahujwe', (req, res)=>{
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
})

router.get('/ibyabonetse', (req, res)=>{
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
})

router.patch('/kwemeza/:id', (req, res)=>{
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
})

router.delete('/ibyatawe/:id', (req, res)=>{
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
})

router.delete('/ibyatoraguwe/:id', (req, res)=>{
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
})

module.exports = router