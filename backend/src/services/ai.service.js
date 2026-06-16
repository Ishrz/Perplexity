import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GIMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateResponse = async (messages) => {
  const formattedMessage = messages.map(msg => 
    msg.role == "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
  )
  const response = await geminiModel.invoke(formattedMessage)
    
  // console.log(response)

  return response.content;
};

export const generateChatTitle = async (message) => {
  const response = await mistralModel.invoke([
    new SystemMessage(
      `you are helpful assistant that generates concise and descriptive title
       for chat conversation.

       User will provide you with the first message of chat conversation and you will
        generate a title that capture the essence of the message
       `
    ),
    new HumanMessage(
      `
      generate a titile for a chat conversation based on the following first message:
      "${message}"
      `
    ),
  ]);

  return response.text
};
