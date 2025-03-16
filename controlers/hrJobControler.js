const HrJobModel = require("../models/hr/hrJobModel");
const HrModel = require("../models/hr/HrModel");
const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const hrJobPost = async (req, res) => {
  try {
    const hrId = req.hrId;
    console.log("hr id from hrjob controler:", hrId);
    const {
      companyName,
        companyDetails,
        jobTitle,
        jobDescription,
        jobRolesAndResponsibilities,
        skills,
        qualification,
        jobLocation,
        State,
        salary,
        minExp,
        maxExp,
        applicants,
        jobType,
        education
        

    } = req.body
    const photo = req.file ? req.file.filename : undefined;

    const hr = await HrModel.findById(hrId);
    if (!hr) {
      return res.status(400).json({ message: "hr not found" });
    } else {
      const hrjob = new HrJobModel({
        companyDetails,
        companyName,
        jobTitle,    
        jobDescription,
        jobRolesAndResponsibilities,
        skills,
        qualification,
        jobLocation,
        State,
        salary,
        minExp,
        maxExp,
        applicants,
        jobType,
        education,
        companylogo:photo,
        hrId
      });

      await hrjob.save();
      const hrjobid= hrjob._id;
      hr.hrJobs.push(hrjobid);
      hr.save();
      res
        .status(200)
        .json({ message: "refer job details posted successfully", hrjob });
    }
  } catch (error) {
    console.error("Error ref job post details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const hrJobUpdate = async (req, res) => {
    try {
      const {hrJobId}=req.params
    
      console.log("hrJobId from refjob controler:", hrJobId);
      const hrjob = await HrJobModel.findById(hrJobId);
     
      const {
        
        companyName=hrjob.companyName,
        companyDetails=hrjob.companyDetails,
        jobTitle = hrjob.jobTitle,
        jobDescription = hrjob.jobDescription,
        jobRolesAndResponsibilities = hrjob.jobRolesAndResponsibilities,
        skills = hrjob.skills,
        qualification = hrjob.qualification,
        jobLocation = hrjob.jobLocation,
        State = hrjob.State,
        salary = hrjob.salary,
        minExp = hrjob.minExp,
        maxExp = hrjob.maxExp,
        applicants = hrjob.applicants,
        jobType = hrjob.jobType,
        education = hrjob.education,
        companylogo =hrjob.photo,
        hrId=hrjob.hrId
        
      } = req.body;
      const photo = req.file ? req.file.filename : undefined;
  
    
      if (!hrjob) {
        return res.status(400).json({ message: "hrjob not found" });
      } else {

        
      const updatedHrJob = await HrJobModel.findByIdAndUpdate(hrJobId ,
        {
          companyDetails,
          companyName,
          jobTitle,    
          jobDescription,
          jobRolesAndResponsibilities,
          skills,
          qualification,
          jobLocation,
          State,
          salary,
          minExp,
          maxExp,
          applicants,
          jobType,
          education,
          companylogo:photo,
          hrId,
          updatedAtIST:  new Date(Date.now() + (5.5 * 60 * 60 * 1000))        
        },
        { new: true } 
      );
     
        res
          .status(200)
          .json({ message: "hr job details updated successfully", updatedHrJob });
      }
    } catch (error) {
      console.error("Error ref jobupdate details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

const gethrjobdetails=async(req,res)=>{
  const {hrJobId}=req.params

    try {
        const hrjoddetails= await HrJobModel.findById(hrJobId)
        if(!hrjoddetails){
            return res.status(400).json({message:"job details not found"})
        }else{
            return res.status(200).json({message:"hr job details found",data:hrjoddetails})
        }
        
    } catch (error) {
        console.error("Error hr job details: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}  

const hrAllJobs=async(req,res)=>{
  

    try {
        const hrjoddetails= await HrJobModel.find()
        if(!hrjoddetails){
            return res.status(400).json({message:"job details not found"})
        }else{
            return res.status(200).json({message:"hr job details found",data:hrjoddetails})
        }
        
    } catch (error) {
        console.error("Error hr job details: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}  



module.exports = { hrJobPost, upload,hrJobUpdate,gethrjobdetails,hrAllJobs};
