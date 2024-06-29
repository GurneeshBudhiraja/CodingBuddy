import express from 'express';
import { getGoalFromFirestore } from '../controllers/firebaseDB.controller.js';
import {checkGoalRelevance} from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/checkGoalRelevance",async(req,res)=>{
  try {
    const {uid,tabURL,youtubeTitle} = req.body;
    if(!uid || !tabURL){
      return res.status(400).json({"error :: checkGoalRelevance route": "uid and tabURL are required"});
    } else{
      const userGoalFromFirestore = await getGoalFromFirestore(uid);
      const goal = userGoalFromFirestore.goal;
      const geminiGoalRelevanceResp = await checkGoalRelevance(goal,tabURL,youtubeTitle);
      const geminiGoalRelevanceData = JSON.parse(geminiGoalRelevanceResp);
      return res.status(200).json(geminiGoalRelevanceData);
    }
  } catch (error) {
    return res.status(500).json({"error :: checkGoalRelevance route": error.message});
  }
});



export default router;