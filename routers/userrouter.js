const express=require('express')
const userrouter=express.Router()
const userControler=require('../controlers/userControler')
const {upload}=require('../controlers/userControler')

const {middleware}=require('../middeleware/middleware')
userrouter.post('/signup',userControler.resistration)
userrouter.post('/otp',userControler.otpVerfication)
userrouter.post('/reset',userControler.forgetPassword)
userrouter.post('/new-password/:resetToken',userControler.resetNewPassword)
userrouter.post('/login',userControler.loginUser)
userrouter.get('/get/:userId',middleware,userControler.getUserById)
userrouter.post('/apply-job',userControler.jobApplication)
userrouter.post('/job_delete',userControler.cancelRequest)

userrouter.put('/update',middleware,upload,userControler.updateUserDetails)
userrouter.post('/report',userControler.report)

module.exports=userrouter