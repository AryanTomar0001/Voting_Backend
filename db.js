require('dotenv').config()
const mongoose=require("mongoose")

const mongoURL=process.env.DATABASE_URL
mongoose.connect(mongoURL);
const db=mongoose.connection;
db.on("connected",()=>{
    console.log("Connected to mongoDb Server")
})

db.on("error",(err)=>{
    console.log("COnnection err",err)
})

db.on('disconnected',()=>{
    console.log("Server disconnected")
})

module.exports=db
