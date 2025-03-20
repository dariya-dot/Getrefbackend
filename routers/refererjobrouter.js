const express=require('express')
const referJobRouter=express.Router()
const referrerJobControler=require('../controlers/referalJobControler')
const {upload}=require('../controlers/referalJobControler')
const {refmiddleware}=require('../middeleware/middleware')
const path=require('path')

referJobRouter.post("/jobpost",refmiddleware,referrerJobControler.refrerJobPost)
referJobRouter.put("/jobupdate/:refJobId",refmiddleware,referrerJobControler.refrerJobUpdate)
referJobRouter.get("/job/:refJobId",referrerJobControler.getRefjobdetails)
referJobRouter.get("/alljobs",referrerJobControler.alljobdetails)
referJobRouter.get("/referrer/:referrerId",refmiddleware,referrerJobControler.getJobsByReferrer)
referJobRouter.get("/job/application/:refJobId",refmiddleware,referrerJobControler.getJobApplications)
referJobRouter.post("/delete",refmiddleware,referrerJobControler.deleteJob)

module.exports = referJobRouter