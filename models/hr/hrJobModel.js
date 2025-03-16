const mongoose = require("mongoose");

const HrJobPostSchema = new mongoose.Schema(
  {
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: "Hr", required: true },
    // companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    companyDetails: { type: String, required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobRolesAndResponsibilities: { type: [String], required: true },
    skills: { type: [String], required: true },
    qualification: { type: String,default:""},
    
    jobLocation: { type: String, required: true },
    State:{type: String,required: true},
    salary: { type: String, required: true },
    minExp: { type: Number, required: true },
    maxExp: { type: Number, required: true },
    applicants: { type: Number, default:""},
    jobType: { 
      type: String, 
      enum: ["Full-Time", "Part-Time", "Contract", "Internship"], default:"Full-Time",
      required: true 
    },

    education: { type: String, default:""},

    companylogo: { type: String , default:""},
   
    createdAtIST:  { 
      type: Date, 
      default: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000)) 
    },
    updatedAtIST: { 
      type: Date, 
      default: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000)) 
    }, 
  }
  
);

const HrJobModel = mongoose.model("HrJobPost", HrJobPostSchema);
module.exports = HrJobModel;
