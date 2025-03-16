const express=require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const userrouter=require('./routers/userrouter')
const referRouter=require("./routers/refererrouter")
const referJobRouter=require('./routers/refererjobrouter')
const hrRouter=require("./routers/hrrouter")
const hrJobRouter=require('./routers/hrJobrouter')
const cors=require('cors')
const path=require('path')
const app=express()
const port = process.env.PORT || 4001;
dotenv.config()
app.use(express.json());
app.use(cors())
   
const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI)
.then(()=>{console.log("the Mongoose connection is sucessful")})
.catch((error)=>{console.error(error)})

app.get('/', (req, res) => {
    res.send(`Server running at port ${port}`);
});



app.use('/user',userrouter)
app.use('/referer',referRouter)
app.use('/jobref',referJobRouter)
app.use('/hr',hrRouter)
app.use('/hrjob',hrJobRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'build')));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});