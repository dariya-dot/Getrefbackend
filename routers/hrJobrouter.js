const express=require('express')
const hrJobRouter=express.Router()
const hrJobControler=require('../controlers/hrJobControler')
const {upload}=require('../controlers/hrControler')
const { hrmiddleware } = require('../middeleware/middleware')


hrJobRouter.post("/jobpost",hrmiddleware,upload.single("photo"),hrJobControler.hrJobPost)
hrJobRouter.put("/update/:hrJobId",upload.single("photo"),hrJobControler.hrJobUpdate)
hrJobRouter.get("/get/:hrJobId",hrJobControler.gethrjobdetails)
hrJobRouter.get("/alljobs",hrJobControler.hrAllJobs)



module.exports = hrJobRouter