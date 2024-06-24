import express from 'express';
const router = express.Router();
import { createAccount, authenticateAccount, getCurrentUser } from '../utils/firebaseAuth.js';
router.post("/signup",async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        if(email && password){
            const user = await createAccount(email,password);
            
            res.status(200).json({user:user});
        } else {
            res.status(400).json({error:"Please enter email and password"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
    }
})

router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        if(email && password){
            const user = await authenticateAccount(email,password);
            const {uid,accessToken}  = user.user;
            res.json({uid,accessToken, message:"204"});
        } else{
            res.status(400).json({error:"Please enter email and password", message:"400"});
        }
    } catch (error) {
        res.status(500).json({error:error, message:"500"});
    }
})

router.post("/getuser",async(req,res)=>{
    try {
        const user = await getCurrentUser();
        if(user){
            res.status(200).json({user:user});
        } else {
            res.json({user:null});
        }
    } catch (error) {
        return res.status(500).json({error:error});
    }
});


export default router;