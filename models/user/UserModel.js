const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profession: { type: String, default:"" },
    company: { type: String, default:"" },
    phone: { type: Number, default:0o0},
    otp:{type:String}, 
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: {type:String, default:""},
    resetPasswordExpiresAt:{type:Date ,default:""},
    education: { type: String ,default: "" },
    skills: [{ type: String }], 
    experience: { type: Number, default: 0 }, 
    address: { type: String ,default: ""},
    git: { type: String ,default: ""},
    linkedIn: { type: String ,default: ""},
    State: { type: String ,default: ""},
    City: { type: String ,default: ""},
    resume: { type: String ,default: ""}, 
    photo:{type:String,default: ""},
    offerLetter_or_experienceCertificate: { type: String ,default: ""}, 
    createdAt: { type: Date, default: Date.now },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReferelJobModel" }],
   
  },{ minimize: false });
  const UserModel=mongoose.model("UserModel",userSchema)
  module.exports=UserModel