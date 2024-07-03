document.querySelector("button").addEventListener("click",async()=>{
    try {
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        console.log(email,password); // will remove later
        const response = await fetch("http://localhost:3000/auth/login/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email,password})
        });
        const data = await response.json();
        const {uid,accessToken,message} = data;

        if(message==="204"){
            chrome.storage.sync.set({uid:uid,accessToken:accessToken});
            const data = await chrome.storage.sync.get(["uid","accessToken"]);
            console.log("Data is",data);
            alert("User has been logged in successfully!");
            chrome.tabs.getCurrent(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });            
        } else {
            alert("User login failed. Please try again later.");
            chrome.tabs.getCurrent(function(tab) {
                chrome.tabs.remove(tab.id, function() {});
            });
        }
    } catch (error) {
        console.log(error.message);
    }
});