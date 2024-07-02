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
      if(request.isYoutubeURL) document.getElementsByTagName("video")[0].pause();
      
      const visitTime = new Date().toLocaleString();
      const resp = await createPopup("The URL is irrelevant. Do you want to exit?");
      console.log("showvisitTime is :: ",visitTime);
      console.log("resp is :: ",resp);
      if(resp){
        chrome.runtime.sendMessage({didExit:true,visitTime,...request});
      } else{
        if(request.isYoutubeURL) document.getElementsByTagName("video")[0].play();
        chrome.runtime.sendMessage({didExit:false,visitTime,...request});
      }
    } catch (error) {
      console.log(error.message)
    }
    return true;
  } else if(request.task === "idleTimePopup") {
    const {idleStartTime, uid} = request;
    const idlePopupResp = await idlePopup("You have been idle for a while. Do you want to exit?");
    if(idlePopupResp){
      const idleEndTime = new Date().toLocaleString();
      const url = window.location.href;
      chrome.runtime.sendMessage({task:"addIdleTimeData" ,idleStartTime,idleEndTime,uid, url, didEnd:true});
    }
  }
})

// ------ Start :: Handling Idle Time :: Start -------

// IIFE for adding the event listener as soon as the content script is loaded

;(() => {
  const mouseEvents = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'contextmenu'];
  
  const keyboardEvents = ['keydown', 'keyup'];
  
  let setTimeoutVariable;
  
  mouseEvents.forEach((mouseEvent) => {
    document.addEventListener(mouseEvent, resetTimeout);
  });
  
  keyboardEvents.forEach((keyboardEvent) => {
    document.addEventListener(keyboardEvent, resetTimeout);
  });

  function resetTimeout() {
    clearTimeout(setTimeoutVariable);
    setTimeoutVariable = setTimeout(() => {
      sendIdleMessageToBackground("No activity detected");
    }, 100);
  }

  function sendIdleMessageToBackground(msg) {
    console.log(msg);
    chrome.runtime.sendMessage({ task: "idleTime" });
  }
})();

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



function idlePopup(msg) {
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
    popup.style.textAlign = 'center';
    
    // Create a message paragraph
    const message = document.createElement('p');
    message.innerText = msg;
    popup.appendChild(message);
    
    // Create a timer paragraph
    const timer = document.createElement('p');
    let idleSeconds = 10; //start from 10 seconds
    let idleMinutes = 0;  
    let idleHours = 0;
    timer.innerText = `Idle time: ${idleHours} hours, ${idleMinutes} minutes, ${idleSeconds} seconds`;
    popup.appendChild(timer);
    
    // Create the Exit button
    const exitButton = document.createElement('button');
    exitButton.innerText = 'Exit';
    exitButton.onclick = function() {
      document.body.removeChild(popup);
      clearInterval(timerInterval);
      resolve(true);
    };
    popup.appendChild(exitButton);
    
    // Add the popup to the body
    document.body.appendChild(popup);
    
    // Update the timer every second
    const timerInterval = setInterval(() => {
      idleSeconds++;
      if (idleSeconds >= 60) {
        idleSeconds = 0;
        idleMinutes++;
      }
      if (idleMinutes >= 60) {
        idleMinutes = 0;
        idleHours++;
      }
      timer.innerText = `Idle time: ${idleHours} hours, ${idleMinutes} minutes, ${idleSeconds} seconds`;
    }, 1000);
    
  });
}
  
  
// -------- End :: utils function for the content script :: End --------