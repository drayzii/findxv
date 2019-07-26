const express = require('express')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const Nataye = require('../models/nataye')
const Natoraguye = require('../models/natoraguye')

const router = express.Router();

cloudinary.config({
    cloud_name: 'drayzii',
    api_key: '684962114961327',
    api_secret: 'nd7rO_KTFnhyfkRXCS4pqzgIyjA'
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
    .then(result=>{
        res.status(201).json({
            status: 201,
            data : result
        })
        res.end()
    })
    .catch(()=>{
        res.status(500).json({ 
            status: 500,
            error: 'Ooops! Something went wrong.'
        })
        res.end()
    })
})
router.post('/natoraguye', (req, res)=>{ 
    if (req.files) {
        const file = req.files.photo;
        cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
            if (error) {
                res.status(500).json({
                    status: 500,
                    error
                });
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
                .then(result1=>{
                    res.status(201).json({
                        status: 201,
                        data : result1
                    })
                    res.end()
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
    } else {
        res.status(400).json({
            status: 401,
            error: 'You should provide the picture'
        })
    }
})

module.exports = router