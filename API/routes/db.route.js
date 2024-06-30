import express, { query } from 'express';
import { addGoalToFirestore, getGoalFromFirestore, addCodeSnippetToFirestore,addVisitedURL,addIdleTimeData } from '../controllers/firebaseDB.controller.js';


const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Testing :: Database Route' });
});

router.post("/adduser",async (req,res)=>{
    try {
        const collectionName = "test"; //will change the collection name later
        const {name,age} = req.body;
        console.log(req.body);
        const resp = await addDataToFirestore(collectionName,name,age);
        return res.status(200).json(resp.id);
    } catch (error) {
        return res.status(500).json("Error: "+error);
    }
});

router.post("/addgoal",async (req,res)=>{
    try {
        const collectionName = "userGoals";
        const {goal, uid} = req.body;
        if(!goal || !uid){
            return res.status(400).json({"error :: addgoal route": "goal and uid are required"});
        }
        const resp = await addGoalToFirestore(collectionName,{goal,uid});
        return res.status(200).json({resp});
    } catch (error) {
        return res.status(500).json({"error :: addgoal route": error});
    }
});
router.get("/getgoal/:id",async(req,res)=>{
    try {
        const uid = req.params.id;
        if(!uid) return res.status(400).json({"error :: getgoal route": "uid is required"});
        const resp = await getGoalFromFirestore(uid);
        if(!resp) return res.status(404).json({"error :: getgoal route": "No goal found for the user"});
        return res.status(200).json(resp);
    } catch (error) {
        return res.status(500).json({"error :: getgoal route": error.message});
    }
});

router.post("/addsnippet",async (req,res)=>{
    try {
        const {uid,codeSnippet} = req.body;
        if(!uid || !codeSnippet){
            return res.status(400).json({"error :: addsnippet route": "uid and codeSnippet are required"});
        } else{
            const resp = await addCodeSnippetToFirestore(uid,codeSnippet);

            if(!resp) {
                return res.status(400).json({codeSnippet:false});
            };

            return res.status(200).json({resp: resp["id"]});
        }
    } catch (error) {
        return res.status(500).json({"error :: addsnippet route": error.message});
    }
});

router.post("/addVisitedURL/:id",async(req,res)=>{
    try {
        const uid = req.params.id;
        // checking for uid
        if(!uid) return res.status(400).json({"error :: addVisitedURL route": "uid is required"});
        const data = req.body;
        console.log(req.body, "uid is",uid);
        const collectionName = "visitedURL";
        const resp = await addVisitedURL(collectionName,uid,data);
        return res.status(200).json({resp});

    } catch (error) {
        return res.status(500).json({"error :: addVisitedURL route": error.message});
    }
})

router.post("/addIdleTime/:id",async(req,res)=>{
    try {
        const uid = req.params.id;
        if(!uid) return res.status(400).json({"error :: addIdleTime route": "uid is required"});
        const {idleTime,endTime,URL} = req.body;
        if(!idleTime || !endTime || !URL) return res.status(400).json({"error :: addIdleTime route": "idleTime, endTime and URL are required"});
        const collectionName = "usersIdleTime";
        const resp = await addIdleTimeData(collectionName,uid,{
            idleTime,
            endTime,
            URL,
        });
        return res.status(200).json({resp});
    } catch (error) {
        return res.status(500).json({"error :: addIdleTime route": error.message});
    }
});



export default router;