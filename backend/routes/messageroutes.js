import express from "express";
import { sendMessage, getAllMessages } from "../controller/messagecontroller.js";
import adminAuth from "../middleware/adminAuth.js";
import isAuth from "../middleware/isAuth.js";

const messageRoutes = express.Router();

messageRoutes.post("/contact", isAuth, sendMessage);
messageRoutes.get("/messages", adminAuth, getAllMessages); // admin only

export default messageRoutes;
