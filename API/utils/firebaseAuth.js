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
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}


export {createAccount,authenticateAccount}