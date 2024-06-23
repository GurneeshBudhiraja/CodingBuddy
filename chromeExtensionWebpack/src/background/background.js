let tabID=undefined; // current tabId
let tabURL = undefined; // current tabURL
const visitedURLs = []; // list of visited URLs
let startTimer; // timer to check the visited URL after 20 seconds


// ------ Start ::  Logic for finding the tab URL :: Start ------------

// retrieving the updated tab URL
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status == 'complete'){
    clearTimeout(startTimer); // clearing the timer
    startTimer = setTimeout(() => {
    logTabURL(tabId);
    }, 20000);
  }
}); 

// retrieving the activated tab URL
chrome.tabs.onActivated.addListener(function(activeInfo) {
  const {tabId} = activeInfo;
  clearTimeout(startTimer); // clearing the timer 
  startTimer = setTimeout(() => {
    logTabURL(tabId);
  },20000);
});

// set for preventing duplicate tab URL
const tabIdSet = new Set();

// function to retrieve the tab URL using tabID
function logTabURL(tabId) {
  let deletingSetElementTimeout;
  clearTimeout(deletingSetElementTimeout); // clearing the timeout

  if(tabIdSet.has(tabId)) return; // checking if the tabId is already present in the set
  tabIdSet.add(tabId);
  console.log("Tabidset after adding is",tabIdSet);
  chrome.tabs.get(tabId, function(tab){
    // checking if the url exists
    if(tab?.url){
      tabURL = tab.url;
      tabID = tab.id;
    }
  });
  setTimeout(()=>appendVisitedURLs(tabID,tabURL), 1000);


  // setting a timeout to delete the tabId from the set after 1 second
  deletingSetElementTimeout = setTimeout(() => {
    tabIdSet.delete(tabId);
    console.log("Tabidset after deletion is",tabIdSet); 
  }, 1000);
  return;
} 

// ------ End :: Logic for sending the tab URL :: End ------------

// ----- Start :: Logic for appending the URL to the visitedURLs :: Start -------
async function appendVisitedURLs(tabID,tabURL){
  try {
    let isYoutubeURL = false;
    let youtubeVideoId = null;
    let youtubeVideoTitle = null;
    
    if(tabURL && (tabURL.includes("chrome://") || !tabURL.trim().length)) return; // checking if the URL is a chrome URL or empty
  
    if(tabURL.includes("https://www.youtube.com/watch?v=")){
      isYoutubeURL = true;
      youtubeVideoId = tabURL.split("https://www.youtube.com/watch?v=")[1];
      const resp = await new Promise((resolve,reject)=>{
          chrome.tabs.sendMessage(tabID, {task: "retrieveYoutubeVideoTitle"},(resp)=>{
            if (chrome.runtime.lastError || !resp) {
              console.error("Error retrieving YouTube title:", chrome.runtime.lastError); 
              resolve(null);
            } else{
              resolve(resp);
            }
        })
      }) 
      youtubeVideoTitle = resp?.response;
    } 
    const date = new Date().toLocaleString();
    visitedURLs.unshift({tabID,tabURL,isYoutubeURL,youtubeVideoTitle,youtubeVideoId,date});
    console.log("Visited URLs are",visitedURLs);
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
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "copyCodeSnippet") {
    const {selectionText} = info;
    const resp = await chrome.tabs.sendMessage(tab.id,{task:"copyCodeSnippet",codeSnippet:selectionText});
  }
});

// ------ End :: Logic for context menus :: End -------
