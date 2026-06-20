import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage,tool ,createAgent} from "langchain";
import * as z from "zod"
import { SearchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GIMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(SearchInternet,{
  name:"internetSearch",
  description:"use this tool to get latest information from internet",
  schema:z.Object({
    query:z.string().describe("the search query to look up on the internet")
  })
})

const agent = createAgent({
  model: mistralModel,
  tools:[searchInternetTool]
})

export const generateResponse = async (messages) => {
  const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...(messages.map(msg => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            })) ]
    });
    
  // console.log(response)

  return response.messages[ response.messages.length - 1 ].text;
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
