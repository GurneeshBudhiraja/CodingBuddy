import { collection, addDoc } from "firebase/firestore";
import db from "../firebaseConfig.js";

export const addGoal = async(collectionName,name,age)=>{
    try {
        return await addDoc(collection(db,collectionName),{
            name,
            age
        });
    } catch (error) {
        return error;
    }
}