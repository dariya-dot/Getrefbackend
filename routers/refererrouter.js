const express=require('express')
const referRouter=express.Router()
const referrerControler=require('../controlers/referrerControler')
const {upload}=require('../controlers/referrerControler')
const {refmiddleware}=require('../middeleware/middleware')


referRouter.post('/signup',referrerControler.refRegistration)
referRouter.post('/login',referrerControler.loginrefer)
referRouter.get('/get/:referrerId',referrerControler.getreferById)
referRouter.post('/reset',referrerControler.forgetPassword)
referRouter.post('/otp',referrerControler.otpVerfication)
referRouter.post('/new-password/:resetToken',referrerControler.resetNewPassword)

referRouter.put('/update',refmiddleware,upload.single("photo"),referrerControler.updateReferDetails)

referRouter.get('/uploads/:imageName', (req, res) => {   
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));

});
module.exports=referRouter