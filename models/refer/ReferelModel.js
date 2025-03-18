const mongoose = require("mongoose");
const referrerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp:{type:String},
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: {type:String, default:""},
  resetPasswordExpiresAt:{type:Date ,default:""},
  photo:{type: String, default:""},
  phone: { type: String,default:"" },
  company: { type: String, default:""},
  jobTitle: { type: String, default:"" },
  jobLocation:{type: String,default:""},
  referedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReferelJobModel" }],
  jobseeker:[{type:mongoose.Schema.Types.ObjectId,ref:"UserModel"}]
}, { timestamps: true },({ minimize: false }));

const ReferralModel=mongoose.model("ReferralModel",referrerSchema)
module.exports=ReferralModel