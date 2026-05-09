import express from "express";
import { chat } from "./ai.controller.js";
import { protect } from "../../middleware/authorization.js";

const router = express.Router();

router.post("/chat", protect, chat);

export default router;