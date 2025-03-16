const UserModel=require('../models/user/UserModel')
const ReferelModel=require('../models/refer/ReferelModel')
const HrModel=require("../models/hr/HrModel")
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')

dotenv.config()
const secretKey = process.env.KEY; 
const middleware=async(req,res,next)=>{
    const {token} = req.headers
    console.log("midtoken " , token)
    if(!token){
        return res.status(401).json({message:"Token is missing from the request "})
    }
    try {
       const decoded=jwt.verify(token,secretKey)
        console.log(decoded)
       
       const isUser= await UserModel.findById(decoded.id)
        console.log(isUser)
        if(!isUser){
            return res.json({message:"user. not found"})
        }
        req.userId=isUser._id
        next()
    } catch (error) {
        console.log("middleware",error)
        return res.status(404).json({ message: "Middleware issue" });

    }
}

const refmiddleware= async (req,res,next)=>{

    const {token}=req.headers
    console.log("token fron the middleware",token)
    if(!token){
        return res.status(400).json({message:"token not found in middleware"})
    }
    try {

        const decoded=  jwt.verify(token,secretKey)
        console.log(decoded)
       const referer=await ReferelModel.findById(decoded.id)
       console.log(referer)
       if(!referer){
        return res.json({message:"referer not found"})
    }else{
         req.refId=referer._id
        console.log("ref id from the middleware",req.refId)
        next()
    }
    } catch (error) {
        console.log("middleware",error)
        return res.status(404).json({ message: "Middleware issue" });
    }
}





const hrmiddleware= async (req,res,next)=>{

    const {token}=req.headers
    console.log("token fron the middleware",token)
    if(!token){
        return res.status(400).json({message:"token not found in middleware"})
    }
    try {

        const decoded=  jwt.verify(token,secretKey)
        console.log(decoded)
       const hr=await HrModel.findById(decoded.id)
       console.log(hr)
       if(!hr){
        return res.json({message:"hr not found in middleware"})
    }else{
         req.hrId=hr._id
        console.log("hr id from the middleware",req.hrId)
        next()
    }
    } catch (error) {
        console.log("middleware",error)
        return res.status(404).json({ message: "Middleware issue" });
    }
}


module.exports={middleware,refmiddleware,hrmiddleware}