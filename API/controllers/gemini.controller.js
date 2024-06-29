import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const checkCodeSnippet = async(codeSnippet)=>{ 
  if(!codeSnippet) throw new Error("Code snippet is required");
  try {
  const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});
  const generationConfig = {
    temperature: 0.25,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "You will act as codeChecker. your main job is to analyse the input text. If the input text contains code of any type, you will segregate the code from it and return the following: isCodePresent, code and shortName where shortName will be a short name given to the code snippet which should be less than or equal to 10 words. If the text does not contain any code then you will just return false.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "{\n\"isCodePresent\": true,\n\"code\": \"const { GoogleGenerativeAI } = require(\\\"@google/generative-ai\\\");\\n\\n// Access your API key as an environment variable (see \\\"Set up your API key\\\" above)\\nconst genAI = new GoogleGenerativeAI(process.env.API_KEY);\\n\\nconst model = genAI.getGenerativeModel({ model: \\\"gemini-1.5-flash\\\"});\"\n}\n\n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(codeSnippet);
  return result.response.text();

  } catch (error) {
    return error.message;
  }
};

const checkGoalRelevance = async(goal,tabURL,youtubeTitle)=>{
  if(!goal || !tabURL) throw new Error("Goal/tabURL is required");
  try {
  const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});
  const generationConfig = {
    temperature: 0.25,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "You will act as goal checker where your main job is to verify whether the goal decided matches with the website URL and if it is a youtube video the title will be presented to you. Your main task is to give a relevance score of -1,0 and 1, where -1 stands for completely irrelevant, 0 stands for the cases when you would not be able to distinguish and 1 is for the cases in which websites are completely relevant to the goal provided. You will just return a JSON with one property which is the relevance\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I'm ready to be your goal checker!  I'll analyze the provided goal and website information (URL or YouTube title) and give you a relevance score in JSON format. \n\nHere's how I'll structure my response:\n\n```json\n{\n  \"relevance\":  // This will be -1, 0, or 1 \n}\n```\n\n**Give me the goal and the website information, and I'll get to work!** \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(`Goal: ${goal}\nTab URL: ${tabURL}\nYoutube Title: ${youtubeTitle}`);
  return result.response.text();

  } catch(error){
    return error.message;
  }
}

export {checkCodeSnippet, checkGoalRelevance};