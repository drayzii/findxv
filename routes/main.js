const express = require('express')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const Nataye = require('../models/nataye')
const Natoraguye = require('../models/natoraguye')

const router = express.Router();

cloudinary.config({
    cloud_name: 'fraterne',
    api_key: '732255275258672',
    api_secret: '1If_1CJ2qr3Z2Dykn6eO7jwW84s'
  })

router.post('/nataye', (req, res)=>{
    const { 
        amazina,
        telefone,
        akarere,
        umurenge,
        akagari,
        umudugudu,
        ubwoko,
        indangamuntu,
        icyangombwa,
        email
     } = req.body
    
    Nataye
    .findOne({ icyangombwa })
    .then(result => {
        if(result){
            res.redirect('/?status=exists')
        } else{
            const newNataye = new Nataye({
                amazina,
                telefone,
                akarere,
                umurenge,
                akagari,
                umudugudu,
                ubwoko,
                indangamuntu,
                icyangombwa,
                email
            })
            newNataye.save()
            .then(()=>{
                res.redirect('/?status=success')
            })
            .catch(()=>{
                res.redirect('/?status=failed')
            })
        }
    })
    .catch(()=>{
        res.redirect('/?status=failed')
    })
})

router.post('/natoraguye', (req, res)=>{ 
    const file = req.files.ifoto;
    cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
        if (error) {
            res.redirect('/?status=failed')
        } else {
            const { 
                amazina,
                telefone,
                akarere,
                umurenge,
                akagari,
                umudugudu,
                ubwoko,
                indangamuntu,
                icyangombwa,
                email,
                ubusobanuro
            } = req.body
            const newNatoraguye = new Natoraguye({
                amazina,
                telefone,
                akarere,
                umurenge,
                akagari,
                umudugudu,
                ubwoko,
                indangamuntu,
                icyangombwa,
                email,
                ifoto: result.url,
                ubusobanuro
            })
            newNatoraguye.save()
            .then(()=>{
                res.redirect('/?status=success')
            })
            .catch(()=>{
                res.redirect('/?status=failed')
            })
        }
    })
})

router.post('/nataye/en', (req, res)=>{
    const { 
        amazina,
        telefone,
        akarere,
        umurenge,
        akagari,
        umudugudu,
        ubwoko,
        indangamuntu,
        icyangombwa,
        email
     } = req.body
    
    Nataye
    .findOne({ icyangombwa })
    .then(result => {
        if(result){
            res.redirect('/en?status=exists')
        } else{
            const newNataye = new Nataye({
                amazina,
                telefone,
                akarere,
                umurenge,
                akagari,
                umudugudu,
                ubwoko,
                indangamuntu,
                icyangombwa,
                email
            })
            newNataye.save()
            .then(()=>{
                res.redirect('/en?status=success')
            })
            .catch(()=>{
                res.redirect('/en?status=failed')
            })
        }
    })
    .catch(()=>{
        res.redirect('/en?status=failed')
    })
})

router.post('/natoraguye/en', (req, res)=>{ 
    const file = req.files.ifoto;
    cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
        if (error) {
            res.redirect('/en?status=failed')
        } else {
            const { 
                amazina,
                telefone,
                akarere,
                umurenge,
                akagari,
                umudugudu,
                ubwoko,
                indangamuntu,
                icyangombwa,
                email,
                ubusobanuro
            } = req.body
            const newNatoraguye = new Natoraguye({
                amazina,
                telefone,
                akarere,
                umurenge,
                akagari,
                umudugudu,
                ubwoko,
                indangamuntu,
                icyangombwa,
                email,
                ifoto: result.url,
                ubusobanuro
            })
            newNatoraguye.save()
            .then(()=>{
                res.redirect('/en?status=success')
            })
            .catch(()=>{
                res.redirect('/en?status=failed')
            })
        }
    })
})

module.exports = router