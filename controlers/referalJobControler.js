const ReferelJobModel = require("../models/refer/ReferalJobModel");
const ReferralModel = require("../models/refer/ReferelModel");
const UserModel = require("../models/user/UserModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder where the uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  },
});
const upload = multer({ storage: storage });

const refrerJobPost = async (req, res) => {
  console.log("req.body: ", req.body);
  console.log("req.file: ", req.file);
  try {
    const refId = req.refId;
    console.log("ref id from refjob controler:", refId);
    const {
      companyName,
      companydetails,
      jobTitle,
      skills,
      resposibilites,
      qualification,
      jobDescription,
      minExp,
      Vacancy,
      salary,
      lastDate,
      State,
      City,
      jobType,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log(req.file.filename);

    const referer = await ReferralModel.findById(refId);
    if (!referer) {
      return res.status(400).json({ message: "referer not found" });
    } else {
      const RefJobpost = new ReferelJobModel({
        companyName,
        companydetails,
        jobTitle,
        skills,
        resposibilites,
        qualification,
        jobDescription,
        minExp,
        Vacancy,
        salary,
        lastDate,
        State,
        City,
        jobType,
        image,
        referrer: refId,
      });

      await RefJobpost.save();
      const RefJobId = RefJobpost._id;
      referer.referedJobs.push(RefJobId);
      referer.save();
      res
        .status(200)
        .json({ message: "refer job details posted successfully", RefJobpost });
    }
  } catch (error) {
    console.error("Error ref jobost details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refrerJobUpdate = async (req, res) => {
  try {
    const { refJobId } = req.params;
    console.log("refJobId from refjob controler:", refJobId);
    const refererJob = await ReferelJobModel.findById(refJobId);
    const {
      companyName = refererJob.companyName,
      jobTitle = refererJob.jobTitle,
      skills = refererJob.skills,
      jobLocation = refererJob.jobLocation,
      Vacancy = refererJob.Vacancy,
      jobDescription = refererJob.jobDescription,
      jobRolesAndResponsibilities = refererJob.jobRolesAndResponsibilities,
      salary = refererJob.salary,
      minExp = refererJob.minExp,
      jobType = refererJob.jobType,
      lastDate = refererJob.lastDate,
    } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    if (!refererJob) {
      return res.status(400).json({ message: "refererJob not found" });
    } else {
      const refererJobupdate = await ReferelJobModel.findByIdAndUpdate(
        refJobId,
        {
          companyName,
          Vacancy,
          jobRolesAndResponsibilities,
          jobTitle,
          skills,
          jobLocation,
          jobDescription,
          salary,
          minExp,
          jobType,
          photo,
          lastDate,
          updatedDate: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
        { new: true }
      );

      res
        .status(200)
        .json({
          message: "refer job details updated successfully",
          refererJobupdate,
        });
    }
  } catch (error) {
    console.error("Error ref jobupdate details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRefjobdetails = async (req, res) => {
  const { refJobId } = req.params;

  try {
    const refjoddetails = await ReferelJobModel.findById(refJobId);
    if (!refjoddetails) {
      return res.status(400).json({ message: "job details not found" });
    } else {
      return res
        .status(200)
        .json({ message: "ref job details found", data: refjoddetails });
    }
  } catch (error) {
    console.error("Error ref job details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const alljobdetails = async (req, res) => {
  try {
    const joddetails = await ReferelJobModel.find();
    if (!joddetails) {
      return res.status(400).json({ message: "job details not found" });
    } else {
      return res
        .status(200)
        .json({ message: "ref job details found", data: joddetails });
    }
  } catch (error) {
    console.error("Error ref job details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getJobsByReferrer = async (req, res) => {
  try {
    const { referrerId } = req.params;

    console.log("backend ref id", referrerId);
    const referrer = await ReferralModel.findById(referrerId);

    if (!referrer) {
      return res.status(404).json({ message: "Referrer not found." });
    }

    // Extract job IDs from referedJobs array
    const jobIds = referrer.referedJobs;

    // Find all jobs that match these IDs
    const jobs = await ReferelJobModel.find({ _id: { $in: jobIds } });

    if (!jobs.length) {
      return res
        .status(404)
        .json({ message: "No jobs found for this referrer." });
    }

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// get all job applicants

const getJobApplications = async (req, res) => {
  try {
    const { refJobId } = req.params;

    console.log("backend ref job id", refJobId);
    const refjob = await ReferelJobModel.findById(refJobId);
    const applicants = refjob.application;

    if (!refjob) {
      return res.status(404).json({ message: "job id  not found." });
    } else if (!applicants.length) {
      return res
        .status(404)
        .json({ message: "No applicants found for this job." });
    } else {
      const userIds = refjob.application;
      const applicantUsers = await UserModel.find({ _id: { $in: userIds } });

      res.status(200).json({ success: true, data: applicantUsers });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  const { refJobId, referrerId } = req.body;
  try {
    const refer = await ReferralModel.findByIdAndUpdate(
      referrerId,
      { $pull: { referedJobs: refJobId } },
      { new: true }
    );
    const job = await ReferelJobModel.findByIdAndDelete(refJobId);
    if (!job) {
      return res.status(400).json({ message: "Job not found" });
    }
    return res
      .status(200)
      .json({ message: "Job  deleted successfully", refer: refer });
  } catch (error) {
    console.error("Error deleting job :", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  refrerJobPost: [upload.single("photo"), refrerJobPost],
  refrerJobUpdate,
  getRefjobdetails,
  alljobdetails,
  getJobsByReferrer,
  getJobApplications,
  deleteJob,
};
