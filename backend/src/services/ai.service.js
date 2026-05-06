import { ChatGoogleGenerativeAI, } from "@langchain/google-genai";
import {AIMessage} from "langchain"
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GIMINI_API_KEY
});



export const giminiModelCall = async ()=>{
    const response = await model.invoke("where is dehli")

console.log(response.content)
}