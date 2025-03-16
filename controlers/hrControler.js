const HrModel = require("../models/hr/HrModel")
const multer=require('multer')
const path=require('path')
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const hrRegistration = async(req,res)=>{
    const {name,email,phone,idCardNumber,designation,password}=req.body
    const photo = req.file ? req.file.filename : undefined;
    try {
        const exitHr=await HrModel.findOne({email})
        if(exitHr){
            return res.status(400).json({message:"this email is alredy registerd"})
        }else{

          const hashedpassword= await bcrypt.hash(password,10)
            const newHr= new HrModel({
                name,email,phone,idCardNumber,designation,password:hashedpassword,photo
            })
          await  newHr.save()
         
       return res.status(201).json({message:"hr details created : ",newHr})
        }
    } catch (error) {
        console.error("error in hr controler",error)
        return res.status(500).json({message:"internal server error"})
    }
}



const hrlogin = async(req,res)=>{
  const {email,password}=req.body
 
  try {
      const exitHr=await HrModel.findOne({email})
      if(!exitHr){
          return res.status(400).json({message:"this email is not registerd"})
      }
      else if(exitHr &&  ! (await bcrypt.compare(password,exitHr.password))){
        return res.status(400).json({message:"you have entered wrong password"})
      }
      
      else{
          
        const token=  jwt.sign({ id: exitHr._id }, process.env.KEY, { expiresIn: "1d" })
      
       
     return res.status(201).json({message:"hr loged in  : ",token,exitHr})
      }
  } catch (error) {
      console.error("error in hr controler",error)
      return res.status(500).json({message:"internal server error"})
  }
}


module.exports={upload,hrRegistration,hrlogin}