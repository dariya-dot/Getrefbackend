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
referJobRouter.get("/referrer/:referrerId",referrerJobControler.getJobsByReferrer)
referJobRouter.get("/job/application/:refJobId",referrerJobControler.getJobApplications)
referJobRouter.post("/delete",referrerJobControler.deleteJob)
// referJobRouter.get('/uploads/:imageName', (req, res) => {   
//     const imageName = req.params.imageName;
//     res.header('Content-Type', 'image/jpeg');
//     res.sendFile(path.join(__dirname, '..', 'uploads', imageName));

// });
module.exports = referJobRouter