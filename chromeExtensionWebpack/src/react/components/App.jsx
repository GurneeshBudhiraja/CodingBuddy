import React, { useEffect, useState } from 'react';
import GoogleSignin from './GoogleSignin';
import "../../assets/tailwind.css"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(()=>{
    chrome.runtime.sendMessage(({type:"checkUser"}),function(resp){
      console.log("User is",resp?.items);
      if(resp?.items?.isAuthenticated){
        setIsAuthenticated(true);
      }
    });
  },[])
  const signInWithEmail = ()=>{
    console.log("button clicked")
    chrome.runtime.sendMessage({ type: 'emailSignIn' });
  }
  return (
    <div className="main h-36 w-[380px] bg-[#131314] px-4 py-2 my-4">
      {isAuthenticated ? <p className='text-green-500'>You are signed in</p> : <p className='text-red-500'>You are not signed in</p>}
      <div id="title" className="text-xl">Coding Buddy</div>
      <div className="text-[#5D5F5F] mt-2">Your personal assistant to help you stay productive and focused.</div>
      {/* Sign in with Email button */}
      <button id="signInWithEmail" className="mt-4 bg-red-500" onClick={signInWithEmail} hidden={isAuthenticated} >Sign in with email</button>
      <div className="flex text-center mt-4 gap-2">
        <div className="gradient-border w-[75%] border-2 border-solid rounded-xl tracking-wide">
          <input
            type="text"
            className="w-full p-2 outline-none bg-[#1e1f20] caret-customGray text-customGray placeholder:text-[#5D5F5F]"
            placeholder="What do you want to achieve today?"
          />
        </div>
        <button id="submitGoal"><img src="assets/submitGemini.svg" alt="Submit Button" /></button>
      </div>
    </div>
  );
};

export default App;
