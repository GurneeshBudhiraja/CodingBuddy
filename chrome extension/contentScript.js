console.log("Content script is running for the gemini competition!");

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
  } else if(request.task==="copyCodeSnippet"){ // copying the code snippet to the clipboard
    try {
      const {codeSnippet} = request;
      navigator.clipboard.writeText(codeSnippet);
      alert("Code snippet copied to clipboard!");
      sendResponse({response:true});
    } catch (error) {
      sendResponse({response:false});
      console.log("Error while copying to clipboard :: ",error.message);
      alert("Error while copying to clipboard!");
    }
    return true;
  }
})