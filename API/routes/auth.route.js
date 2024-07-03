import express from 'express';
const router = express.Router();
import { createAccount, authenticateAccount, getCurrentUser } from '../controllers/firebaseAuth.controller.js';
router.post("/signup",async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password) throw new Error("Please enter email and password");
        if(email && password){
            const user = await createAccount(email,password);
            const {uid,accessToken}  = user.user;
            res.status(200).json({message:"204",uid,accessToken});
        } else {
            res.status(400).json({error:"Please enter email and password",message:"400"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:error.message,message:"500"});
    }
})

router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password) throw new Error("Please enter email and password");
        if(email && password){
            const user = await authenticateAccount(email,password);
            const {uid,accessToken}  = user.user;
            res.json({uid,accessToken, message:"204"});
        } else{
            res.status(400).json({error:"Please enter email and password", message:"400"});
        }
    } catch (error) {
        res.status(500).json({error:error.message, message:"500"});
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