console.log("Content script is running for the gemini competition!");


// Message listener for the content script
chrome.runtime.onMessage.addListener(async (request,sender,sendResponse)=>{
  console.log("From content script message");
  if(request.task==="retrieveYoutubeVideoTitle"){ // retrieving the youtube video title
    try {
      const youtubeVideoTitle = document.querySelector("#above-the-fold").querySelector("#title").innerText;
      sendResponse({response:youtubeVideoTitle});
    } catch (error) {
      sendResponse({response:"Error in setTimeout function"});
    }
    return true;
  } else if(request.task==="invalidCodeSnippet"){ // copying the code snippet to the clipboard
    try {
      alert("Please select the code snippet to store in firestore!");
      sendResponse({status:"alertShown"});
    } catch (error) {
      console.log("Error while showing the alert box!");
    }
    return true;
  } else if(request.task==="codeSnippetStored"){
    alert("Code snippet copied successfully!");
  } else if(request.task==="invalidCodeSnippet"){
    alert("Please select the code snippet to store in firestore!");
  } else if(request.task==="irrelevantURL"){
    try {
      /* 
      {
        "task": "irrelevantURL",
        "uid": "DBnQDnqjbDMq6PdDd8OslrCrEQF3",
        "tabURL": "https://www.youtube.com/watch?v=H5aFWHIeUJo",
        "isYoutubeURL": true,
        "youtubeVideoTitle": "IND vs SA | ICC T20 World Cup 2024 Final - Virat Kohli Retires… - Tabish Hashmi - Haarna Mana Hay",
        "youtubeVideoId": "H5aFWHIeUJo"
        }
        */
      if(request.isYoutubeURL) document.getElementsByTagName("video")[0].pause();
      
      const popupTime = new Date().toUTCString();
      const resp = await createPopup("The URL is irrelevant. Do you want to exit?");
      console.log("showPopupTime is :: ",popupTime);
      console.log("resp is :: ",resp);
      if(resp){
        chrome.runtime.sendMessage({didExit:true,popupTime,...request});
      } else{
        if(request.isYoutubeURL) document.getElementsByTagName("video")[0].play();
        const stayTime = new Date().toUTCString();
        console.log("stayTime is :: ",stayTime);
        chrome.runtime.sendMessage({didExit:false,popupTime,stayTime,...request});
      }
    } catch (error) {
      console.log(error.message)
    }
    return true;
  } else if(request.task==="neutralURL"){
    try {
      if(request.isYoutubeURL) document.getElementsByTagName("video")[0].pause();
      const popupTime = new Date().toUTCString();
      const resp = await createPopup("The URL can be irrelevant. Do you want to exit?");
      console.log("showPopupTime is :: ",popupTime);
      if(resp){
        chrome.runtime.sendMessage({didExit:true,popupTime,...request});
      } else{
        if(request.isYoutubeURL) document.getElementsByTagName("video")[0].play();
        const stayTime = new Date().toUTCString();
        console.log("stayTime is :: ",stayTime);
        chrome.runtime.sendMessage({didExit:false,popupTime,stayTime,...request});
      }
    } catch (error) {
      console.log(error.message);
    }
    return true;
  }
})

// ------ Start :: Handling Idle Time :: Start -------

// IIFE for adding the event listener as soon as the content script is loaded

const mouseEvents = ['click','dblclick','mousedown','mouseup','mousemove','mouseenter','mouseleave','mouseover','mouseout','contextmenu',]; // list of mouse events
const keyboardEvents = ['keydown','keyup',]; // list of keyboard events

;(()=>{
  let IDLE_TIME = 120000; // anything above 2 minutes is considered as idle time
  let setTimeoutIdleTime;  
  let startIdleTime;
  // adding all the mouse events to the webpage
  mouseEvents.forEach((mouseEvent)=>{
    // triggering another timeout function after every mouse event
    document.addEventListener(mouseEvent,()=>{
      clearTimeout(setTimeoutIdleTime); // clearing the timeout
      setTimeoutIdleTime = setTimeout(()=>{
        startIdleTime = new Date().toLocaleString();
        console.log("reason :: mouseEvent");
        const {resp,endIdleTime} = resetIdleTimeFunction();
        const idleTimeData = {
          startIdleTime,
          endIdleTime,
          resp,
        }
        console.log(idleTimeData);
      },IDLE_TIME);
    })
  });
  keyboardEvents.forEach((keyboardEvent)=>{
    document.addEventListener(keyboardEvent,()=>{
      clearTimeout(setTimeoutIdleTime); // clearing the timeout
      setTimeoutIdleTime = setTimeout(()=>{
        console.log("reason :: keyboardEvent");
        startIdleTime = new Date().toLocaleString(); // for recording the start time of the idle time
        const {resp, endIdleTime} = resetIdleTimeFunction();
        const idleTimeData = {
          startIdleTime,
          endIdleTime,
          resp,
        }
        console.log(idleTimeData);
      },IDLE_TIME);
    })
  });
})();

function resetIdleTimeFunction(){
  const resp = confirm("You have been idle for more than 2 minutes. Do you want to exit?");
  let endIdleTime = null;
  if(resp){
    endIdleTime = new Date().toLocaleString();
  } 
  return {resp, endIdleTime};
}

// ------- End :: Handling Idle Time :: End -------


// -------- Start :: utils function for the content script :: Start --------
function createPopup(msg) {
  return new Promise((resolve) => {
    // Create a container div for the popup
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.border = '1px solid #000';
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';

    // Create a message paragraph
    const message = document.createElement('p');
    message.innerText = msg;
    popup.appendChild(message);

    // Create the Exit button
    const exitButton = document.createElement('button');
    exitButton.innerText = 'Exit';
    exitButton.onclick = function() {
      document.body.removeChild(popup);
      resolve(true);
    };
    popup.appendChild(exitButton);

    // Create the Ignore button
    const ignoreButton = document.createElement('button');
    ignoreButton.innerText = 'Ignore';
    ignoreButton.style.marginLeft = '10px';
    ignoreButton.onclick = function() {
      document.body.removeChild(popup);
      resolve(false);
    };
    popup.appendChild(ignoreButton);

    // Add the popup to the body
    document.body.appendChild(popup);
  });
}


// -------- End :: utils function for the content script :: End --------