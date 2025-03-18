const UserModel = require("../models/user/UserModel");
const ReferelJobModel= require("../models/refer/ReferalJobModel")
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { sendOTPToUser,useResetLink } = require("../emails/email");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.KEY, { expiresIn: "1d" });
};
const resistration = async (req, res) => {
  const { name, email, password } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    } else if (!validator.isEmail(email)) {
      return res.status(401).json({ message: "Please Enter the valid email" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        otp,
      });
      await newUser.save();
      const userId = newUser._id;
      sendOTPToUser(newUser);
      console.log("registration sucess", newUser);
      return res.status(201).json({
        message: "user resister sussfully",
        userId,
        data:newUser,
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
    const user = await UserModel.findOne({ email });

    if (!user.email) {
      return res
        .status(401)
        .json({ message: "user not found in otpAthentication in backend" });
    } else if (user.otp !== otp) {
      console.log("otp not matched");
      return res.status(400).json({ message: "you entered wrong otp" });
    } else {
      user.otp = "";
      user.isVerified = true;
      await user.save();
      console.log(user);
      return res
        .status(201)
        .json({ message: "user authenticated sussfully", data:user });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

const resetNewPassword = async (req, res) => {
  const { resetToken } = req.body;
  const { password } = req.body;
  console.log(resetToken.resetToken, password);
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: resetToken.resetToken,
    });
    if (!user) {
      console.log("user not found")
      return res.status(400).json({ message: "user not found" });

    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = "";
      user.resetTokenExpiresAt = "";

      await user.save();
      console.log(user)
      return res.status(201).json({ message: "password updated", user });
      
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
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log(user);
      return res
        .status(401)
        .json({ message: "user not fount with this email" });
    } else {
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 30 * 60 * 1000; // 30 minutes

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      const   resetLink=`http://localhost:5173/forgetpassword/${resetToken}` 
      await user.save();
      useResetLink(
        user,
        resetLink
      );

      return res
        .status(201)
        .json({ message: "reset link sent ", user, resetToken });
    }
  } catch (error) {
    console.error(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "This email is not registered" });
    } 
    else if (!(await bcrypt.compare(password, user.password))) {
      console.log("Email and password are incorrect")
      return res
        .status(401)
        .json({ message: "Email and password are incorrect" });
        
    }
     else if (user && !user.isVerified) {
      await user.deleteOne({ email });
      return res
        .status(403)
        .json({
          message:
            "Your account was not verified and has been removed. Please register again.",
        });
    } 
    else {
      const token = generateToken(user._id);
      const userId = user._id;
      const userName = user.name;
      console.log("Jwt token:", token, "userId:", userId, userName);
      res
        .status(201)
        .json({
          message: "userlogin is sucessfull",
         data: user,
          userId,
          userName,
          token,
        });
    }
  } catch (error) {
    console.error("Login error:", error);
  res.status(500).json({ message: "Internal server error" });
  }
};



const getUserById = async (req, res) => {
  const {userId} = req.params;
  console.log(userId)
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    else {
      const application = await UserModel.findById(userId).populate("appliedJobs");
      res.status(200).json({message:"user fetched",data: user,application:application.appliedJobs });
      console.log("userDetails from backend ", user);
      console.log("applied jobs from backend ", application);
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

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error("Invalid file type. Only PDF, JPG, and PNG are allowed."), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "photo", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "offerLetter", maxCount: 1 },
]);

const updateUserDetails = async (req, res) => {
 
  try {
      const userId = req.userId; 
      const existingUser= await UserModel.findById(userId)
      const {
        profession  ,
        company ,
        phone ,
        education ,
        skills  ,
        address ,
        experience ,
        state ,
        git ,
        linkedIn ,city
      } = req.body;
      const photo = req.files?.photo
      ? req.files.photo[0].path.replace(/^uploads[\\/]/, "")
      : existingUser.photo;

    const resume = req.files?.resume
      ? req.files.resume[0].path.replace(/^uploads[\\/]/, "")
      : existingUser.resume;

    const offerLetter = req.files?.offerLetter
      ? req.files.offerLetter[0].path.replace(/^uploads[\\/]/, "")
      : existingUser.offerLetter_or_experienceCertificate;


      const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          {
             
              education :education || existingUser.education ,
              skills :skills || existingUser.skills,
              address : address || existingUser.address,
              experience : experience || existingUser.experience,
              profession:profession || existingUser.profession,
              company:company||existingUser.company,
              phone:phone||existingUser.phone,
              State:state||existingUser.State,
              git:git||existingUser.git,
              linkedIn:linkedIn||existingUser.linkedIn,
              City:city||existingUser.City,
              
  
              ...(photo ? { photo } : {}) ,
              ...(resume && { resume }),
              ...(offerLetter && { offerLetter_or_experienceCertificate: offerLetter })
          },
          { new: true, runValidators: true } 
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User details updated successfully", data: updatedUser });
  } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}

const jobApplication =async(req,res)=>{
  try {
    const {userId,refJobId}=req.body
    const findjob=await ReferelJobModel.findById(refJobId)
    const finduser= await UserModel.findById(userId)
    if (!finduser){
      return res.status(400).json({message:"user not found"})
    }else {
      if (finduser.appliedJobs.includes(refJobId)){
        return res.status(200).json({message:"job alredy applied",data:refjobdetails})
      }
      else{
        finduser.appliedJobs.push(refJobId)
        findjob.application.push(userId)
        await findjob.save()
        await finduser.save()
        console.log("applied")
        return res.status(200).json({message:"Job application submitted successfully",data:finduser})

      }
     
    }
  
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"server error"})
  }
}

const cancelRequest = async (req, res) => {
  const { userId, refJobId } = req.body;

  try {
   
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { appliedJobs: refJobId } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    
    const job = await ReferelJobModel.findByIdAndUpdate(
      refJobId,
      { $pull: { applications: userId } }, 
      { new: true }
    );

    if (!job) {
      return res.status(400).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job application canceled successfully" });
  } catch (error) {
    console.error("Error canceling job application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  resistration,
  otpVerfication,
  forgetPassword,
  resetNewPassword,
  loginUser,
  getUserById,
  updateUserDetails,upload,jobApplication,cancelRequest
};
