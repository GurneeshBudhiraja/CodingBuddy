import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// will extract the code or convert the text to code
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
    history: [
      {
        role: "user",
        parts: [
          {text: `You will act as codeChecker. your main job is to analyse the input text. If the input text contains code of any type, you will segregate the code from it and return the following: isCodePresent:true , code and shortName where shortName will be a short name given to the code snippet which should be less than or equal to 10 words. If the text does not contain any code but do contain instructions that can be converted to code then return the code without comments and a shortname for that chunk of code. If the instructions are not clear or just contain a simple sentence you can ignore the text and just return the false. At last, if there are any instructions/pseudocode that can be converted to the code, please work on that and return the code in the format mentioned above. Also keep in mind the code should only include code and not the comments.\n`},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I'm ready to be your codeChecker!  I'll analyze your text input and let you know if I find code or instructions I can convert to code and will also remove irrelevant text to make the code working. Here's a breakdown of how I'll respond:\n\n**Possible Responses**\n\n* **Scenario 1: Code is Present**\n\n    ```json\n    {\n      \"isCodePresent\": true,\n      \"code\": \"<The extracted code snippet>\",\n      \"shortName\": \"<A concise name (<= 10 words) describing the code>\"\n    }\n    ```\n\n* **Scenario 2: Instructions Convertible to Code**\n\n    ```json\n    {\n      \"isCodePresent\": true,\n      \"code\": \"<The generated code (without comments)>\",\n      \"shortName\": \"<A concise name (<= 10 words) describing the code>\"\n    }\n    ```\n\n* **Scenario 3: No Code or Unclear Instructions**\n\n    ```json\n    {\n      \"isCodePresent\": false \n    }\n    ```\n\n**Example Interaction**\n\n**You:** Write a Python function that takes two numbers and returns their sum. \n\n**Me:**\n\n```json\n{\n  \"isCodePresent\": true,\n  \"code\": \"def calculate_sum(a, b):\\n  return a + b\",\n  \"shortName\": \"Python Function for Sum of Two Numbers\"\n}\n```\n\n**Ready to put me to work?  Give me your text!** \n{}"},
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
          {text: "You will act as goal checker where your main job is to verify whether the goal decided matches with the website URL and if it is a youtube video the title will be presented to you. Your main task is to give a relevance score of -1,0 and 1, where -1 stands for completely irrelevant, 0 stands for the cases when you would not be able to distinguish and 1 is for the cases in which websites are completely relevant to the goal provided. You will just return a JSON with one property which is the relevance. Also, the another property that you will provide is the relevanceReason in no more that 30 words. In the relevanceReason you will provide the short description on what made you feel like that. Make sure to enter the goal in there and a simple brief reason for the RAG.\n"},
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