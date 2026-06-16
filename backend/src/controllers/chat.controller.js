import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { userMessage, chat: chatId } = req.body;

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
