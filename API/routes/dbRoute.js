import express from 'express';
import { addGoal } from '../utils/firebaseDB.js';


const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Testing :: Database Route' });
});

router.post("/adduser",async (req,res)=>{
   try {
     const {name,age,collectionName} = req.body;
     console.log(req.body);
     const resp = await addGoal(collectionName,name,age);
     return res.status(200).json(resp.id);
   } catch (error) {
    return res.status(500).json("Error: "+error);
   }
})
export default router;