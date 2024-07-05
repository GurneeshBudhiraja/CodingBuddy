import express from 'express';
import { addGoalToFirestore, getGoalFromFirestore, addCodeSnippetToFirestore,addVisitedURL,addIdleTimeData } from '../controllers/firebaseDB.controller.js';
import {checkCodeSnippet} from "../controllers/gemini.controller.js";

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
            const geminiCheckCodeSnippetResponse = await checkCodeSnippet(codeSnippet);
            const geminiJSObject = JSON.parse(geminiCheckCodeSnippetResponse); // converting the response to JS object
            console.log(`geminiJSObject in addsnippet route: ${geminiJSObject}`);
            if(geminiJSObject["isCodePresent"]===false) return res.status(200).json({
                isCodePresent: geminiJSObject["isCodePresent"],
                code:"",
                shortName:"",
            });
            else if(geminiJSObject["isCodePresent"]===true){
                const resp = await addCodeSnippetToFirestore(uid,geminiJSObject["code"],geminiJSObject["shortName"]);
                if(!resp["id"]) throw new Error("Error adding code snippet to firestore");
                return res.status(200).json({
                    isCodePresent: true,
                    code: geminiJSObject["code"] || "",
                    shortName: geminiJSObject["shortName"] || "",
                    id:resp.id,
                });
            }
        }
    } catch (error) {
        return res.status(500).json({error: `error :: db route :: addsnippet route :: ${error.message}`});
    }
});

router.post("/addvisitedurl/:id",async(req,res)=>{
    try {
        const uid = req.params.id;
        // checking for uid
        if(!uid) return res.status(400).json({"error :: addVisitedURL route": "uid is required"});
        const data = req.body;
        const collectionName = "visitedURL";
        const resp = await addVisitedURL(collectionName,uid,data);
        return res.status(200).json({resp});

    } catch (error) {
        return res.status(500).json({"error :: addVisitedURL route": error.message});
    }
})

router.post("/addidletime/:id",async(req,res)=>{
    try {
        const uid = req.params.id;
        if(!uid) return res.status(400).json({"error :: addIdleTime route": "uid is required"});
        const {idleStartTime,idleEndTime,url} = req.body;
        if([idleStartTime, idleEndTime, url].some((item)=>!item)) return res.status(400).json({"error :: addIdleTime route": "idleStartTime, idleEndTime and url are required"});
        const collectionName = "usersIdleTime";
        const resp = await addIdleTimeData(collectionName,uid,{
            idleStartTime,
            idleEndTime,
            url,
        });
        return res.status(200).json({resp});
    } catch (error) {
        return res.status(500).json({"error :: addIdleTime route": error.message});
    }
});



export default router;