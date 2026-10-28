import express from "express";
import {
  clearConversation,
  deleteMessage,
  editMessage,
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  markMessagesAsRead,
  sendMessage,
  toggleReaction,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);
router.put("/mark-as-read/:id", markMessagesAsRead);
router.put("/:id/react", toggleReaction);
router.put("/:id/edit", editMessage);
router.delete("/conversations/:id", clearConversation);
router.delete("/:id", deleteMessage);

export default router;
