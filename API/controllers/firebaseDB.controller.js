import { collection, addDoc, query,where, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";
import db from "../firebaseConfig.js";
import {checkCodeSnippet} from "./gemini.controller.js";

export const addGoalToFirestore = async(collectionName,data={})=>{
    try {
        if(!Object.keys(data).length===0 || !collectionName) throw new Error("Data and collection name are required");
        const time = Timestamp.now();
        data["createdAt"] = time; // adding the timestamp to the data
        const resp = await getGoalFromFirestore(data.uid);
        if(Object.keys(resp).length===0){
            return await addDoc(collection(db,collectionName),data);
        } else{
            const docRef = doc(db,collectionName,resp.id);
            await updateDoc(docRef,{
                goal: data.goal,
                createdAt: time
            });
            return "Goal updated successfully";
        }
    } catch (error) {
        return error.message;
    }
}

export const getGoalFromFirestore = async(uid)=>{
    try {
        let resp = false;
        if(!uid) throw new Error("uid is required");
        const q = query(collection(db,"userGoals"), where("uid","==",uid)); // query for fetching the goal of the user with uid
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            resp = doc.data();
            resp["id"] = doc.id;
        });
        return resp;
    } catch (error) {
        return error;
    }
}


export const addCodeSnippetToFirestore = async(uid,code, shortName)=>{
    try {
        if(!uid || !code) throw new Error("uid and codeSnippet are required");
        const userDocRef = doc(db, "codeSnippetsCollection", uid); // all the snippets will be under copiedCodeSnippets collection
        const userCodeSnippets = collection(userDocRef, "userCodeSnippets"); // collection for the user's code snippets
        return await addDoc(userCodeSnippets,{
            code,
            createdAt: Timestamp.now(),
            shortName,
        });
    } catch (error) {
        return error.message;
    }
} 

export const addVisitedURL=async(collectionName,uid,data)=>{
    try {
        if(!uid) throw new Error("uid is required");
        const userDocRef = doc(db, collectionName, uid);
        const urlEntriesCollection = collection(userDocRef, "urlEntries");
        const firestoreRespData = await addDoc(urlEntriesCollection, {
            createdAt: Timestamp.now(),
            ...data
        });
        return firestoreRespData.id;

    } catch (error) {
        return error.message;
    }
}


export const addIdleTimeData = async(collectionName,uid,data)=>{
    try {
        if(!uid) throw new Error("uid is required");
        const userDocRef = doc(db, collectionName, uid);
        const idleTimeCollection = collection(userDocRef, "idleTime");
        const firestoreRespData = await addDoc(idleTimeCollection, {
            createdAt: Timestamp.now(),
            ...data
        });
        return firestoreRespData.id;
    } catch (error) {
        return error.message;
    }
};