const express=require("express");
require('dotenv').config();
const router=express.Router();

const User=require("./../Model/user");
const {jwtAuthMiddleware,generateToken}=require("./../jwt");

//POST route to add a person

router.post('/signup',async (req,res)=>{
    try{
        const data=req.body;

        //check if there is already an admin user
        const adminUser=await User.findOne({role:'admin'});
        if(data.role==='admin' && adminUser){
            return res.status(400).json({error:'Admin user already exists'});
        }

        //Validate Adhar card Number must have exactly 12 digit

        if(!/^\d{12}$/.test(data.aadharCardNumber)){
            return res.status(400).json({error:'Aadhar Card Number must be exactly 12 digits'})
        }

        //check if a user with the same Adhar Card Number already exists
        const extistingUser=await User.findOne({aadharCardNumber:data.aadharCardNumber});
        if(extistingUser){
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        //create a new user to the dataBase

        const newUser=new User(data);

        //save the new user to the database
        const response=await newUser.save();
        console.log('data saved');

        const payload={
            id:response.id
        }

        console.log(JSON.stringify(payload));
        const token=generateToken(payload);

        res.status(200).json({response:response ,token:token});
        
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
})


//login Route

router.post('/login',async(req,res)=>{
    try{
        //extract aadhar card and passsword from request body
        const{aadharCardNumber,password}=req.body;

        //check if adharCardNumber and password is missing or not
        if(!aadharCardNumber || !password){
            return res.status(400).json({error:'Aadhar Card Number and password are required'})
        }

        //find the user by aadharcardNumber

        const user=await User.findOne({aadharCardNumber});

        if(!user){
            return res.status(401).json({error:"Invalid adhar Card Number"})
        }
        const isMatch= await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({error:"Invalid Password"})
        }
        //generate token
        const payload={
            id:user.id
        }
        const token=generateToken(payload);

        //return token as response

        res.json({token})
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"})
    }
});

//profile route

router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
    try{
        const userData=req.user;
        const userId=userData.id;

        const user=await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
})


//profile password update

router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
    try{
        const userId=req.user.id;
        const{currentPassword ,newPassword}=req.body;

        //check if currentPassword and newPassword are persent in the request body
        if(!currentPassword || !newPassword){
            return res.status(400).json({error :'Both currentPassword and newPassword are required'});
        }

        //find the user by userID
        const user=await User.findById(userId);

        //if user does not exist or password does not match ,return error
        if(!user || !(await user.comparePassword(currentPassword))){
             return res.status(401).json({ error: 'Invalid current password' });
        }


        //update the user's password

        user.password=newPassword;
        await user.save();

        console.log('passowrd updated');
         res.status(200).json({ message: 'Password updated' });
    }catch (err) {
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
})

module.exports=router