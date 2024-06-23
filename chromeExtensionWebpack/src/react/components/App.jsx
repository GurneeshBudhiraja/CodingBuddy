import React from 'react';
import GoogleSignin from './GoogleSignin';
import "../../assets/tailwind.css"

const App = () => {
  return (
    <div className="main h-36 w-[380px] bg-[#131314] px-4 py-2 my-4">
      <div id="title" className="text-xl">Coding Buddy</div>
      <div className="text-[#5D5F5F] mt-2">Your personal assistant to help you stay productive and focused.</div>
      {/* Sign in with Google button */}
      <GoogleSignin />
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
