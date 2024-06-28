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

export {checkCodeSnippet};