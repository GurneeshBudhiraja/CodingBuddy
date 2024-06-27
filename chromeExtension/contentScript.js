console.log("Content script is running for the gemini competition!");

// Message listener for the content script
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
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
