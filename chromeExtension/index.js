console.log("Hello from index.js!");
const singinButton = document.getElementById("signInWithEmail");

(async ()=>{
    const localStorage = await chrome.storage.sync.get(["uid","accessToken"]);
    console.log("Local storage in index.js:",localStorage);
})();



singinButton.addEventListener("click",()=>{
    console.log("Sign in with email button clicked");
    chrome.runtime.sendMessage({type:"emailSignIn"},(resp)=>{
        alert("Response from background.js:", resp);
    });
})