const express=require('express')
const app=express()
const db=require("./db");
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
const PORT=process.env.PORT ||3000;


app.get('/',(req,res)=>{
    res.status(201).json("Hello ji ")
})

const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);
// app.use('/candidate')

app.listen(PORT,()=>{
    console.log("Server run on 3000 port")
})
