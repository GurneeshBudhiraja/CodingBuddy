let tabID = undefined; // current tabId
let tabURL = undefined; // current tabURL
const visitedURLs = []; // list of visited URLs
let startTimer; // timer to check the visited URL after 20 seconds


// -------- Start :: Adding Message Listeners :: Start ------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "emailSignIn") {
        chrome.tabs.create({ url: "./login/login.html" });
    }
  });
  

// -------- End :: Adding Message Listeners :: End ------------

// ------ Start ::  Logic for finding the tab URL :: Start ------------

// retrieving the updated tab URL
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    clearTimeout(startTimer); // clearing the timer
    startTimer = setTimeout(() => {
      logTabURL(tabId);
    }, 20000);
  }
});

// retrieving the activated tab URL
chrome.tabs.onActivated.addListener(function (activeInfo) {
  const { tabId } = activeInfo;
  clearTimeout(startTimer); // clearing the timer
  startTimer = setTimeout(() => {
    logTabURL(tabId);
  }, 20000);
});

// set for preventing duplicate tab URL
const tabIdSet = new Set();

// function to retrieve the tab URL using tabID
function logTabURL(tabId) {
  let deletingSetElementTimeout;
  clearTimeout(deletingSetElementTimeout); // clearing the timeout

  if (tabIdSet.has(tabId)) return; // checking if the tabId is already present in the set
  tabIdSet.add(tabId);
  console.log("Tabidset after adding is", tabIdSet);
  chrome.tabs.get(tabId, function (tab) {
    // checking if the url exists
    if (tab?.url) {
      tabURL = tab.url;
      tabID = tab.id;
    }
  });
  setTimeout(() => appendVisitedURLs(tabID, tabURL), 1000);

  // setting a timeout to delete the tabId from the set after 1 second
  deletingSetElementTimeout = setTimeout(() => {
    tabIdSet.delete(tabId);
    console.log("Tabidset after deletion is", tabIdSet);
  }, 1000);
  return;
}

// ------ End :: Logic for sending the tab URL :: End ------------

// ----- Start :: Logic for appending the URL to the visitedURLs :: Start -------
async function appendVisitedURLs(tabID, tabURL) {
  try {
    let isYoutubeURL = false;
    let youtubeVideoId = null;
    let youtubeVideoTitle = null;

    if (tabURL && (tabURL.includes("chrome://") || !tabURL.trim().length))
      return; // checking if the URL is a chrome URL or empty

    if (tabURL.includes("https://www.youtube.com/watch?v=")) {
      isYoutubeURL = true;
      youtubeVideoId = tabURL.split("https://www.youtube.com/watch?v=")[1];
      const resp = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(
          tabID,
          { task: "retrieveYoutubeVideoTitle" },
          (resp) => {
            if (chrome.runtime.lastError || !resp) {
              console.error(
                "Error retrieving YouTube title:",
                chrome.runtime.lastError
              );
              resolve(null);
            } else {
              resolve(resp);
            }
          }
        );
      });
      youtubeVideoTitle = resp?.response;
    }
    const date = new Date().toLocaleString();
    visitedURLs.unshift({
      tabID,
      tabURL,
      isYoutubeURL,
      youtubeVideoTitle,
      youtubeVideoId,
      date,
    });
    console.log("Visited URLs are", visitedURLs);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

// ---- End :: Logic for appending the URL to the visitedURLs :: End -------

// ------ Start :: Logic for context menus :: Start -------
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyCodeSnippet",
    title: "Copy Code Snippet",
    contexts: ["selection"],
  });
  chrome.tabs.create({ url: "./login/login.html" });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (info.menuItemId === "copyCodeSnippet") {
      const { selectionText } = info;
      // will send the code to the gemini api first to verify is it the actual code snippet :: will do it later 
      console.log("Code snippet copied:", selectionText);
      if(!(selectionText)){
        chrome.tabs.sendMessage(tab.id, {task:"invalidCodeSnippet"});
        return;
      };
      const {uid} = await chrome.storage.sync.get(["uid"]);
      if(!uid){
        alert("No uid is found. Please sign in first.");
        chrome.tabs.create({ url: "./login/login.html" });
        return;
      } 
      const response = await fetch("http://localhost:3000/db/addsnippet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          codeSnippet: selectionText,
        }),
      });
      const data = await response.json();
      if(data["codeSnippet"]===false){
        chrome.tabs.sendMessage(tab.id, {task:"invalidCodeSnippet"});
        return;
      }
      chrome.tabs.sendMessage(tab.id, {task:"codeSnippetStored"});
    }
  } catch (error) {
    console.log("Error copying code snippet:", error.message);
  }
});

// ------ End :: Logic for context menus :: End -------
