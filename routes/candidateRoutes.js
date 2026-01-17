const express = require('express');
const router = express.Router();
require('dotenv').config()
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const User = require('./../Model/user')
const Candidate=require('./../Model/candidate')
//const check adminRole

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        if (user.role === 'admin') {
            return true;
        }
    } catch (err) {
        return false;
    }
}



//candidate post

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message:"User odes not have admin role"})
        }

        const data=req.body;
        const newCandidate=new Candidate(data);
        const response=await newCandidate.save()
        console.log('data saved');
        res.status(200).json({response : response});

    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})
    }
})

//update candidate data

router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message:"User odes not have admin role"})
        }

        const candidateID=req.params.candidateID;
        const updatedCandidateData=req.body;

        const response=await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
            new:true,
            runValidators:true
        })

        if(!response){
            return res.status(404).json({ error: 'Candidate not found' });
        }
        console.log('candidate data updated');
        res.status(200).json({response})
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }


//delete Candidate

router.delete("/:candidateID",jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }


        const candidateId=req.params.candidateID;

        const response=await Candidate.findByIdAndDelete(candidateId);

        if(!response){
            return res.status(404).json({error:' candidate not found'});
        }

        console.log('candidate deleted')
        res.status(200).json(response);
        
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
})
})




//vote count

router.get('/vote/count',async(req,res)=>{
    try{

        //find all candidate and sort them in des
        const candidate=await Candidate.find().sort({voteCount:-1});

        const voteRecord =candidate.map((data)=>{
            return{
                party:data.party,
                count:data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
});


// voting

router.get('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
        candidateID=req.params.candidateID;
        userId=req.user.id;
    
    try{
        //no admin vote 
        //only user can vote

        const candidate=await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }

        if(user.role=='admin'){
            return res.status(403).json({message: 'admin is not allowed'});
        }

        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        //update the candidate document to record the vote
        candidate.votes.push({user:userId})
        candidate.voteCount++;
        await candidate.save();


        //update the userDocument

        user.isVoted=true;
        await user.save();
        return res.status(200).json({ message: 'Vote recorded successfully' });

    }catch(err){
        return res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
});


//get all list of Candidate

router.get('/',async(req,res)=>{
    try{

        const candidates=await Candidate.find({},'name party -_id');

        // return list  of candidates
        res.status(200).json(candidates);
    }catch(err){
        res.status(500).json({error: err ,msg:"Internal Server Error"});
    }
});

module.exports=router;