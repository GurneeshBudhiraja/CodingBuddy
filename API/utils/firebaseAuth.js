import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

async function createAccount(email,password){
    try {
        const auth = getAuth();
        const user  = await createUserWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function authenticateAccount(email,password){
    try {
        const auth = getAuth();
        const user = await signInWithEmailAndPassword(auth,email,password);
        console.log(user)
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getCurrentUser(){
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        console.log(user);
        if(user){
            return user;
        } else{
            return {user:null};
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}


export {createAccount,authenticateAccount,getCurrentUser}