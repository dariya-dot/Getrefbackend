const mongoose = require("mongoose");

const referjobSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "ReferralModel", required: true },
  companyName: { type: String, required: true },
  companydetails:{type: String, default:"" },
  jobTitle: { type: String, required: true },
  skills: { type: String, required: true },
  resposibilites: { type: String,default:""},
  qualification: { type: String,default:""},
  jobDescription: { type: String, required: true },
  State: { type: String, required: true },
  City: { type: String, required: true },
  jobType: { 
    type: String, 
    
    default: "Full-time" 
  },
  minExp:{type:Number,default:0},
  Vacancy:{type:Number,default:0},
  
  
  salary: { type: Number ,default:0},  
  image:{type: String,default:""},
  lastDate:{type: Date,default:""},
  application:[{type: mongoose.Schema.Types.ObjectId, ref: "UserModel",default:[]}],
  postedDate: { 
    type: Date, 
    default: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000)) 
  },
  updatedDate: { 
    type: Date, 
    default: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000)) 
  }
},({ minimize: false }));

const ReferelJobModel = mongoose.model("ReferelJobModel", referjobSchema);
module.exports = ReferelJobModel;
