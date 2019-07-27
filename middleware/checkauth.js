const check = (req,res,next)=>{
if(req.body.email==='fraterne01@gmail.com'&&req.body.password==='fraterne123458'){
    next()
} else{
    res.status(403).json({
        status: 403,
        error: 'Forbidden Route'
    })
}
}

module.exports = check