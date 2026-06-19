import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message: userMessage, chat: chatId } = req.body;

  let title = null,
    chat = null;

  let currentChatId = chatId;

  //for new chat genrating chat title
  if (!chatId) {
    title = await generateChatTitle(userMessage);

    chat = await chatModel.create({
      user: req.user.id,
      title: title,
    });

    currentChatId = chat._id;
  }

  const message = await messageModel.create({
    chat: currentChatId,
    content: userMessage,
    role: "user",
  });

  const allMessages = await messageModel.find({ chat: currentChatId });

  const aiResponseMessage = await generateResponse(allMessages);

  const aiMessage = await messageModel.create({
    chat: currentChatId,
    content: aiResponseMessage,
    role: "ai",
  });

  res.json({
    chat,
    aiMessage,
  });
};


export const getChats = async (req,res) => {
  // const {chatId} = req.parmas

  const chats = await chatModel.find({
    user:req.user.id,
  })

  if(!chats) return res.status(404).json({
    message:"chat not found"
  })

  res.status(200).json({
    message:"chat fetched successfuly",
    chats
  })

}

export const getMessages = async (req,res) => {
  const {chatId} = req.params
  console.log(chatId)
  const chat = await chatModel.findOne({
      _id:chatId,
      user: req.user.id
  })

  if(!chat) return res.status(404).json({
    message:"No chat and Messages found"
  })

  const messages = await messageModel.find({
    chat:chat._id
  })

  res.status(200).json({
    message:"Messages fetched Successfully",
    messages
  })

}

export const chatDelete = async (req,res) =>{

  const {chatId} = req.params

  const chat = await chatModel.findByIdAndDelete({
    _id:chatId,
    user:req.user.id
  })

  await messageModel.deleteMany({
    chat:chat._id
  })

  if(!chat) return res.status(404).json({message:"no chat found"})
  
  res.status(204).json({
    message:"chat deleted successfully"
  })

}