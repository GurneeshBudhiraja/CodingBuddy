const submitGoalButton  = document.getElementById("submitGoal");
const goalInput = document.getElementById("goalInput");
let uid = null;
let accessToken = null;

console.log("Hello from index.js!");

const signInButton = document.getElementById("signInWithEmail");

(async () => {
    const localStorage = await chrome.storage.sync.get(["uid", "accessToken"]);
    uid = localStorage.uid;
    accessToken = localStorage.accessToken;
    console.log("uid:", uid);
    console.log("accessToken:", accessToken);
})();

(() => {
    submitGoalButton.addEventListener("click", async () => {
        console.log("Submit goal button clicked");
        const goal = goalInput.value;
        if (goal) {
            console.log("Goal entered:", goal);
            goalInput.value = goal;
            goalInput.disabled = true;
            await chrome.storage.sync.set({ goal });
            chrome.storage.sync.get(["goal"], (resp) => {
                console.log("Goal saved in storage:", resp);
            });
        } else {
            alert("Please enter a goal");
        }
    });

    goalInput.addEventListener("focus", () => {
        goalInput.disabled = false;
    });
})();

signInButton.addEventListener("click", () => {
    console.log("Sign in with email button clicked");
    chrome.runtime.sendMessage({ type: "emailSignIn" }, (resp) => {
        alert("Response from background.js: " + resp);
    });
});
