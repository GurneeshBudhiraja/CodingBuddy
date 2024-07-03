document.querySelector("button").addEventListener("click",async()=>{
try {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    console.log(email,password); // will remove later
    const response = await fetch("http://localhost:3000/auth/signup/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
    });
    const data = await response.json();
    console.log(data);
    const {uid,accessToken,message} = data;

    if(message==="204"){
        chrome.storage.sync.set({uid:uid,accessToken:accessToken});
        const data = await chrome.storage.sync.get(["uid","accessToken"]);
        console.log("Data is",data);
        alert("Account has been created and logged in as well!");
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function(){});
        });            
    } else {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function(){});
        });
        alert("User not created successfully!");
    }
} catch (error) {
    console.log(error.message);
}
});