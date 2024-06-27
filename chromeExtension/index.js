const goalInput = document.getElementById("goalInput");
let uid = null;
let accessToken = null;
let userGoal = null;
console.log("Hello from index.js!");

const signInButton = document.getElementById("signInWithEmail");

(async () => {
  const localStorage = await chrome.storage.sync.get(["uid", "accessToken"]);
  uid = localStorage.uid;
  accessToken = localStorage.accessToken;
  console.log("uid:", uid);
  if (uid) {
    try {
      goalInput.placeholder = "Loading goal...";

      const userGoalObject = await fetch(`http://localhost:3000/db/getgoal/${uid}`);
      userGoal = await userGoalObject.json();
      if (userGoal.uid === uid && userGoal.goal) {
        goalInput.value = userGoal.goal;

      } else {
        goalInput.placeholder = "What's your goal for today?";

      }
      return;
    } catch (error) {
      console.log("Error fetching user goal:", error.message);
      goalInput.placeholder = "What's your goal for today?";
    }
  }
})();


document.querySelector("#submitGoal").addEventListener("click", async () => {
    const goal = goalInput.value;
    if (goal) {
      try {
        console.log("Goal entered:", goal);
        goalInput.value = goal;
        const response = await fetch("http://localhost:3000/db/addgoal/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
            body: JSON.stringify({
            uid: uid,
            goal: goal,
          }),
        });
        const data = await response.json();
        console.log("Response from server:", data);
        return;
      } catch (error) {
        console.log("Error submitting goal:", error.message);
        alert("Error submitting goal. Please try again.");

        goalInput.placeholder = "What's your goal for today?";
      }
    } else {
      alert("Please enter a goal");
    }
  });


signInButton.addEventListener("click", () => {
  console.log("Sign in with email button clicked");
  chrome.runtime.sendMessage({ type: "emailSignIn" }, (resp) => {
    alert("Response from background.js: " + resp);
  });
});

document.querySelector("#submitGoal").addEventListener("click", async () => {
  alert("Submit goal button clicked");
});