const express=require('express')
const hrRouter=express.Router()
const hrContoler=require('../controlers/hrControler')
const {upload}=require('../controlers/hrControler')


hrRouter.post("/signup",upload.single("photo"),hrContoler.hrRegistration)
hrRouter.post("/signin",hrContoler.hrlogin)


module.exports = hrRouter