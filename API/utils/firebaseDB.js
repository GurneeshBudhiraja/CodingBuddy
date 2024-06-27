import { collection, addDoc, query,where, getDocs, Timestamp } from "firebase/firestore";
import db from "../firebaseConfig.js";


export const addGoalToFirestore = async(collectionName,data={})=>{
    try {
        if(!Object.keys(data).length===0 || !collectionName) throw new Error("Data and collection name are required");
        const time = Timestamp.now();
        data["createdAt"] = time; // adding the timestamp to the data
        return await addDoc(collection(db,collectionName),data);
    } catch (error) {
        return error;
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
        });
        return resp;
    } catch (error) {
        return error;
    }
}


export const addCodeSnippetToFirestore = async(uid,codeSnippet)=>{
    try {
        if(!uid || !codeSnippet) throw new Error("uid and codeSnippet are required");
        const data = {
            uid,
            codeSnippet,
            createdAt: Timestamp.now()
        }
        return await addDoc(collection(db,"codeSnippets"),data);
    } catch (error) {
        return error.message;
    }
} 