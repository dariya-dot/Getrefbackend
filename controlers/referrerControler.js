const ReferralModel = require("../models/refer/ReferelModel");
const ReferalJobModel=require('../models/refer/ReferalJobModel')
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { sendOTPToRef,refResetLink } = require("../emails/email");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')

const generateToken = (refId) => {
  return jwt.sign({ id: refId }, process.env.KEY, { expiresIn: "1d" });
};

const refRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const findRef = await ReferralModel.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (findRef) {
      return res.status(400).json({ message: "User already registered" });
    } else if (!validator.isEmail(email)) {
      return res.status(401).json({ message: "Please Enter the valid email" });
    } else {
      hashedpassword = await bcrypt.hash(password, 10);
      const ref = new ReferralModel({
        name,
        email,
        password: hashedpassword,
        otp,
      });
      await ref.save();
      referId = ref._id;
      sendOTPToRef(ref)
      console.log("registration sucess", ref);
      res.status(201).json({
        message: "Referer resister sussfully",
        referId,
        ref,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

const otpVerfication = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const ref = await ReferralModel.findOne({ email });

    if (!ref.email) {
      return res
        .status(401)
        .json({ message: "user not found in otpAthentication in backend" });
    } else if (ref.otp !== otp) {
      console.log("otp not matched");
      return res.status(400).json({ message: "you entered wrong otp" });
    } else {
      ref.otp = "";
      ref.isVerified = true;
      await ref.save();
      console.log(ref);
      return res
        .status(201)
        .json({ message: "user authenticated sussfully", ref });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

const resetNewPassword = async (req, res) => {
  const { resetToken } = req.body;
  const { password } = req.body;
  console.log(resetToken, password);
  try {
    const ref = await ReferralModel.findOne({
      resetPasswordToken: resetToken.resetToken,
    });
    if (!ref) {
      return res.status(400).json({ message: "user not found" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      ref.password = hashedPassword;
      ref.resetPasswordToken = "";
      ref.resetTokenExpiresAt = "";

      await ref.save();
      return res.status(201).json({ message: "password updated", ref });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const ref = await ReferralModel.findOne({ email });

    if (!ref) {
      console.log(ref);
      return res
        .status(401)
        .json({ message: "user not fount with this email" });
    } else {
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 30 * 60 * 1000; // 30 minutes

      ref.resetPasswordToken = resetToken;
      ref.resetPasswordExpiresAt = resetTokenExpiresAt;
      const   resetLink=`http://localhost:5173/refforgetpassword/${resetToken}` 
      await ref.save();
      refResetLink(
        ref,
        resetLink
      );

      return res
        .status(201)
        .json({ message: "reset link sent ", ref, resetToken });
    }
  } catch (error) {
    console.error(error);
  }
};

const loginrefer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const ref = await ReferralModel.findOne({ email });
    if (!ref) {
      return res.status(400).json({ message: "This email is not registered" });
    } else if (!ref || !(await bcrypt.compare(password, ref.password))) {
      return res
        .status(401)
        .json({ message: "Email and password are incorrect" });
    }
    else if (ref && !ref.isVerified) {
      await ref.deleteOne({ email });
      return res
        .status(403)
        .json({
          message:
            "Your account was not verified and has been removed. Please register again.",
        });
    }
    else {
      const refId = ref._id;
      const token = generateToken(refId);

      const refName = ref.name;
      console.log("Jwt token:", token, "userId:", refId, refName);
      res.status(201).json({
        message: "userlogin is sucessfull",
        data:ref,
        refId,
        refName,
        token,
      });
    }
  } catch (error) {
    console.error("loginerror", error);
  }
};

const getreferById = async (req, res) => {
  const referrerId = req.params.referrerId;
  try {
   
    const ref = await ReferralModel.findById(referrerId)
    if (!ref) {
      return res.status(404).json({ message: "Refer not found" });
    }
    if (ref) {
      
      const jobIds = ref.referedJobs;

      // Find all jobs that match these IDs
      const jobs = await ReferalJobModel.find({ _id: { $in: jobIds } });
      const refdetails = ref;
      res.status(200).json({message:"refdetails",data: refdetails,jobs });
      console.log("refDetails from backend ", refdetails);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "serevr error" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const updateReferDetails = async (req, res) => {
 console.log("req.body",req.body)
 console.log("req.file",req.file)
  try {
    const refId = req.refId;
    const { phone, company, jobTitle, jobLocation } = req.body; 
    const photo = req.file ? req.file.filename : undefined;
    const findref = await ReferralModel.findById( refId );
   

    if (!findref) {
      return res.status(404).json({ message: "refer not found" });
    }
   
      const updatedref = await ReferralModel.findByIdAndUpdate(
        refId,
        {
          phone: phone || findref.phone,
          company: company || findref.company,
          jobTitle: jobTitle || findref.jobTitle,
          jobLocation: jobLocation || findref.jobLocation,
          photo: photo || findref.photo,
        },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "refer details updated successfully", updatedref });
    
  } catch (error) {
    console.error("Error updating referr details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  refRegistration,
  loginrefer,
  getreferById,
  forgetPassword,
  resetNewPassword,
  otpVerfication,
  upload,
  updateReferDetails,
};
