import express from "express";
import Conversation from "../modules/Conversion.js";
import Message from "../modules/Message.js";
import verifyUser from "../middleware/verifyUser.js";
import { GetReceiverSocketId, io } from "../socket/soket.js";

const router = express.Router();

router.get("/read/:receiverId", verifyUser, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/send/:receiverId", verifyUser, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;
    const { content } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [senderId, receiverId] });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content,
      createdAt: Date.now(),
    });

    await newMessage.save();

    const receiverSocketId = GetReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
