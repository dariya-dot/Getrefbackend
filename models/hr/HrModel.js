const mongoose=require("mongoose")

const hrSchmema=new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    idCardNumber:{ type: String, required: true},
    // companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    photo:{type: String,default:""},
    designation: { type: String, required: true },
    password: { type: String, required: true },
    hrJobs: { type: [String]},
    jobapplications: { type: [String]}
},({ minimize: false }))

const HrModel=mongoose.model("HrModel",hrSchmema)
module.exports=HrModel