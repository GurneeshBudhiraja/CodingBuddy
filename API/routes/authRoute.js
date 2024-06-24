import express from 'express';
const router = express.Router();
import { createAccount, authenticateAccount } from '../utils/firebaseAuth.js';
router.post("/signup",async (req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(email,password);
        if(email && password){
            const user = await createAccount(email,password);
            console.log(user);
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
        console.log(email,password);
        if(email && password){
            const user = await authenticateAccount(email,password);
            console.log(user);
            res.status(200).json({user:user});
        } else{
            res.status(400).json({error:"Please enter email and password"});
        }
    } catch (error) {
        res.status(500).json({error:error});
    }
})

export default router;